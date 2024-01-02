import { PythonExtension } from '@vscode/python-extension';



async function activeInterpreter() {
    const pythonApi = await PythonExtension.api();
    const environmentPath = pythonApi.environments.getActiveEnvironmentPath();
    const env = await pythonApi.environments.resolveEnvironment(environmentPath);

    if (!env) {
        throw new Error('No active environment');
    }
    return env;

}

function getMainCommand(virtTool: string): 'pipenv' | 'pip' {
    switch (virtTool) {
        case 'Pipenv':
            return 'pipenv';
        case 'Venv':
        case 'Pyenv':
            return 'pip';
        default:
            throw new Error('Unsupported environment');
    }
}

export async function getInfo() {
    // Получаем информацию об активном интерпретаторе
    const env = await activeInterpreter();
    const virtTool = env.tools[0];
    if (virtTool === undefined) {
        const version = `${env.version?.major}.${env.version?.minor}.${env.version?.micro}`;
        console.log(`Версия Python: ${version}`);
        
        return { version: version };
    }
    else {
        const mainCommand = getMainCommand(virtTool);
        return { mainCommand: mainCommand };
    }
}
