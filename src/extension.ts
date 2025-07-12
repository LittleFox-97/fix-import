import * as vscode from 'vscode';
import { FixImportCodeActionProvider } from './FixImportCodeActionProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "fix-import" is now active!');

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			{ language: 'python', scheme: 'file' },
			new FixImportCodeActionProvider('pip'))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('fix-import.installPackage', async (mainCommand, moduleName: string) => {
			const terminal = vscode.window.createTerminal(`${mainCommand} install ${moduleName}`);
			terminal.sendText(`pip install ${moduleName}`);
			vscode.window.showInformationMessage(`Установка пакета ${moduleName}`);
		})
	);
}



// This method is called when your extension is deactivated
export function deactivate() {}

