import * as vscode from 'vscode';

export async function executeCommand(cmd: string): Promise<void> {
    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal();

    await new Promise<void>((resolve, reject) => {
        const disposable = vscode.window.onDidExecuteTerminalCommand(event => {
            if (event.terminal === terminal && event.commandLine === cmd) {
                disposable.dispose();
                if (event.exitCode === 0) {
                    resolve();
                } else {
                    reject(new Error(`Command failed with exit code ${event.exitCode}`));
                }
            }
        });
        terminal.show();
        terminal.sendText(cmd);
    });
}
