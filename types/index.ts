
export type Question = {
    question: string;
    options: string[];
    correctOption: number;
};

export type Poll = Question[];
