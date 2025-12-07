
import {
    isQuestion
} from "./isQuestion";

export function isQuestions(array: any): array is Question[] {
    return (
        Array.isArray(array) &&  // First check that it’s an array
        array.length > 0 &&      // Optional: ensure it's not empty (optional, depends on your needs)
        array.every(item => isQuestion(item))  // Check every item is a Question
    );
};
