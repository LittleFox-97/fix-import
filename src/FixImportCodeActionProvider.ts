import * as vscode from 'vscode';

export class FixImportCodeActionProvider implements vscode.CodeActionProvider {
  constructor(private readonly mainCommand: 'pipenv' | 'pip') {
  }

  extractPackageName(message: string): string {
    const packageNameMatch = /(?<=")[^"]+(?=")/.exec(message);
    if (!packageNameMatch) {
      throw new Error('No package name found in diagnostic message');
    }

    const packageName = packageNameMatch[0];
    if (packageName.includes('.')) {
      const parts = packageName.split('.');
      if (parts[0] === 'jaraco') {
        return `${parts[0]}.${parts[1]}`;
      }

      return parts[0];
    }

    return packageName;
  }

  provideCodeActions(_document: vscode.TextDocument, _range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext) {
    const codeActions: vscode.CodeAction[] = [];
    const diagnostics = context.diagnostics.filter(
      diagnostic => diagnostic.source === 'Pylance' && typeof diagnostic.code === 'object' && (diagnostic.code.value === 'reportMissingImports' || diagnostic.code.value === 'reportMissingModuleSource'),
    );
    diagnostics.forEach((diagnostic) => {
      const packageName = this.extractPackageName(diagnostic.message);
      console.log(packageName);
      
      const installPackageAction = this.createInstallPackageAction(this.mainCommand, packageName);
      codeActions.push(installPackageAction);
      if (this.mainCommand === 'pipenv') {
        const installPackageActionDev = this.createInstallPackageAction(this.mainCommand, packageName,  '--dev');
        codeActions.push(installPackageActionDev);
      }
    });

    return codeActions;
  }

  private createInstallPackageAction(mainCommand: 'pipenv' | 'pip', packageName: string, devOption?: string): vscode.CodeAction {
    const action = new vscode.CodeAction(`Установить пакет ${packageName}${devOption ? ' (dev)' : ''}`, vscode.CodeActionKind.QuickFix);
    action.command = {
      title: `Установить пакет ${packageName}${devOption ? ' (dev)' : ''}`,
      command: 'fix-import.installWithPip',
      arguments: [mainCommand, packageName, devOption],
    };
    return action;
  }
}