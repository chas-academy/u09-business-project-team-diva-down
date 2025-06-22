function generateUserId(length: number = 10) {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i: number = 0; i < length; i++) {
        if (i < 1) {
            const randomIndex = Math.floor(Math.random() * upperChars.length);
            result += upperChars[randomIndex];
        } else if (i < 3) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            result += numbers[randomIndex];
        } else if (i < 6) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        } else if (i < 8) {
            const randomIndex = Math.floor(Math.random() * numbers.length);
            result += numbers[randomIndex];
        } else if (i < 9) {
            const randomIndex = Math.floor(Math.random() * lowerChars.length);
            result += lowerChars[randomIndex];
        } else {
            result += 'U';
        }
    }
    return result;
};

function GenerateNewId(oldId?: string): string {
    const newId = generateUserId();
    if (oldId && newId === oldId) {
        return generateUserId();
    }
    return newId;
}

export const id = GenerateNewId();