import * as vscode from 'vscode';
import extractPackageName from './getPackageName';


export class MissingImportsCodeActionProvider implements vscode.CodeActionProvider {
    /**
     * Provides an array of CodeAction objects based on the provided parameters.
     *
     * @param {vscode.TextDocument} document - The document to provide CodeActions for.
     * @param {vscode.Range} range - The range to provide CodeActions for.
     * @param {vscode.CodeActionContext} context - The context to provide CodeActions for.
     * @return {vscode.ProviderResult<vscode.CodeAction[]>} An array of CodeAction objects.
     */
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const codeActions: vscode.CodeAction[] = [];

        // Check if the diagnostic is for Pylance ReportMissingImports
        const diagnostic = context.diagnostics.find(
            (diagnostic) => {
                const source = diagnostic.source;
                if (source === 'Pylance') {
                    const code = diagnostic.code;
                    if (typeof code === 'object') {
                        const value = code.value;
                        // TODO: добавить тип ошибки 'reportMissingModuleSource'
                        if (value === 'reportMissingImports'|| value === 'reportMissingModuleSource') {
                            return true;
                        }
                    }
                }
                else {
                    return false;
                }
            }
        );

        if (diagnostic) {
            const message = diagnostic.message;
            // Extract the package name from the diagnostic message
            const packageName = extractPackageName(message);

            // Create CodeAction for installing the package
            const installPackageAction = new vscode.CodeAction(
                `Install package ${packageName}`,
                vscode.CodeActionKind.QuickFix
            );

            // Bind the installPackage command to the CodeAction
            installPackageAction.command = {
                command: 'extension.installPackage',
                title: 'Install Package',
                arguments: [packageName]
            };

            codeActions.push(installPackageAction);
        }

        return codeActions;
    }
}
