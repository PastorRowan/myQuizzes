
export function isQuestion(obj: any): obj is Question {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        typeof obj.query === 'string' &&
        Array.isArray(obj.options) &&
        typeof obj.correctOption === 'number'
    );
};
