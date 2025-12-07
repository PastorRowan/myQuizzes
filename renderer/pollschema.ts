    const pollSchema = {
        type: "array",
        title: "Poll",
        items: {
            type: "object",
            required: ["question", "options", "correctOption"],
            properties: {
                query: {
                    type: "string",
                    title: "Question"
                },
                options: {
                    type: "array",
                    title: "Options",
                    items: {
                        type: "string",
                        title: "Option"
                    },
                    minItems: 2
                },
                correctOption: {
                    type: "number",
                    title: "Correct Option Index",
                    minimum: 0
                }
            }
        }
    };

const dummyData = 
[
    {
        "query": "What is the capital of France?",
        "options": ["Paris", "Berlin", "Madrid", "Rome"],
        "correctOption": 0
    },
    {
        "query": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "correctOption": 1
    },
    {
        "query": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctOption": 1
    }
]
