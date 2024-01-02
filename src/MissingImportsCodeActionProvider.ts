import * as vscode from 'vscode';
import extractPackageName from './getPackageName';


export class MissingImportsCodeActionProvider implements vscode.CodeActionProvider {
    mainCommand: 'pip' | 'pipenv';
constructor(mainCommand: 'pip' | 'pipenv') {
    this.mainCommand = mainCommand;
}
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        context: vscode.CodeActionContext
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const codeActions: vscode.CodeAction[] = [];

        // Check if the diagnostic is for Pylance ReportMissingImports
        const diagnostic = context.diagnostics.find(
            (diagnostic) => {
                return diagnostic.source === 'Pylance' && (typeof diagnostic.code === 'object' && (diagnostic.code.value === 'reportMissingImports'|| diagnostic.code.value === 'reportMissingModuleSource'));
            }
        );

        if (diagnostic) {
            // Extract the package name from the diagnostic message
            const packageName = extractPackageName(diagnostic.message);
            if (this.mainCommand === 'pipenv') {
                const installPackageAction = new vscode.CodeAction(
                    `Установить пакет ${packageName}`, vscode.CodeActionKind.QuickFix
                );
                installPackageAction.command = {
                    command: 'fix-import.installPackage',
                    title: `Установить пакет ${packageName}`,
                    arguments: [this.mainCommand, packageName]
                };
                const installPackageActionDev = new vscode.CodeAction(
                    `Установить пакет ${packageName} (dev)`, vscode.CodeActionKind.QuickFix
                );
                installPackageActionDev.command = {
                    command: 'fix-import.installPackage',
                    title: `Установить пакет ${packageName} (dev)`,
                    arguments: [this.mainCommand, packageName, '--dev']
                };
                codeActions.push(installPackageAction, installPackageActionDev);
            }
            else {
                const installPackageAction = new vscode.CodeAction(
                    `Install package ${packageName}`,
                    vscode.CodeActionKind.QuickFix
                );
    
                // Bind the installPackage command to the CodeAction
                installPackageAction.command = {
                    command: 'fix-import.installPackage',
                    title: 'Install Package',
                    arguments: [this.mainCommand, packageName]
                };
                codeActions.push(installPackageAction);
            }            

        }

        return codeActions;
    }
}
