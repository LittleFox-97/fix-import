import * as vscode from 'vscode';
import { MissingImportsCodeActionProvider } from './MissingImportsCodeActionProvider';


/**
 * Activates the extension and registers the installPackage command and the 
 * MissingImportsCodeActionProvider.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @return {void} This function does not return anything.
 */
export function activate(context: vscode.ExtensionContext): void {
    // Register the installPackage command
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.installPackage', (packageName: string) => {
            installPackage(packageName);
        })
    );
    const provider = new MissingImportsCodeActionProvider();
    // Register the CodeAction provider
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { scheme: 'file', language: 'python' },
            provider
        )
    );
}

/**
 * Installs a Python package using pip.
 *
 * @param {string} packageName - The name of the package to install.
 * @return {void} This function does not return anything.
 */
function installPackage(packageName: string): void {
    // выбираем терминал
    const terminal = vscode.window.activeTerminal;
    if (terminal) {
    terminal.show();
    terminal.sendText(`pip install ${packageName}`);
    }
    else{
        void vscode.commands.executeCommand('python.createTerminal');
    }
}

export function deactivate() {}