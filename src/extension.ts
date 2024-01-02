import * as vscode from 'vscode';
import { getInfo } from './getInfo';
import { executeCommand } from './executeCommand';
import { MissingImportsCodeActionProvider } from './MissingImportsCodeActionProvider';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const info = await getInfo();
   context.subscriptions.push(vscode.commands.registerCommand('fix-import.createPipenv',  async () => {
    if (!info.version) {
        return;
    }
       await createPipenv(info.version);
   }));
   context.subscriptions.push(vscode.commands.registerCommand('fix-import.installPackage',async (mainCommand, packageName: string, ...args: string[]) => {
       await executeCommand(`${mainCommand} install ${args.join(' ')}${packageName}`);
   }));
   const mainCommand = info.mainCommand === undefined ? await createVirt() : info.mainCommand;
   context.subscriptions.push(vscode.languages.registerCodeActionsProvider({scheme: 'file', language: 'python'}, new MissingImportsCodeActionProvider(mainCommand)));

}

async function createVirt() {
    const select = await vscode.window.showErrorMessage('Выбран глобальный интерпретатор. Выберите тип виртуального окружения', 'Pipvenv', 'Default');
    
    switch (select) {
        case 'Pipvenv':
            await vscode.commands.executeCommand('fix-import.createPipenv');
            return 'pipenv';
        case 'Default':
            await vscode.commands.executeCommand('python.createEnvironment');
            return 'pip';
        default:
            throw new Error('Unsupported environment');
    }
}

export function deactivate() {}


async function createPipenv(version: string) {
    try {
        await executeCommand('pipenv --version');
    } catch (e) {
        await executeCommand('pip install pipenv');
    }
    
    await executeCommand('$env:PIPENV_VENV_IN_PROJECT = 1');
    await executeCommand(`pipenv --python ${version}`);
}