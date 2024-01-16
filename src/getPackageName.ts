/**
 * Извлекает имя пакета из строки
 * @param {string} str - Входная строка
 * @returns {string} - Имя пакета
 */
export default function extractPackageName(str: string): string {
    const packageNameMatch = str.match(/(?<=")[^"]+(?=")/);
    if (!packageNameMatch) {
        throw new Error('Text within double quotes not found');
    }
    const packageName = packageNameMatch[0];
    if (packageName.includes('.')) {
        const parts = packageName.split('.');
        return parts[0] === 'jaraco' ? `${parts[0]}.${parts[1]}` : parts[0];
    }
    return packageName;
}
