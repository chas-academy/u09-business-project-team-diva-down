export const MockDataGameLoop = [
    {
        id: 21,
        title: "Custom Trivia Title",
        data: {
            results: [
                {
                    category: "Testing",
                    correct_answer: "Steve",
                    incorrect_answers: [
                        "Arnold",
                        "Max",
                        "Tony"
                    ],
                    question: "What is this man named?",
                    difficulty: "medium",
                }
            ]
        }
    },
    {
        id: 65,
        title: "Movie Night Trivia",
        data: {
            results: [
                {
                    category: "History",
                    correct_answer: "A former Swedish King",
                    incorrect_answers: [
                        "A Polish Diplomate",
                        "A German Dictator",
                        "A Famous Actor in the 1700s"
                    ],
                    question: "Who is Gustav Vasa?",
                    difficulty: 'easy'
                },
                {
                    category: "Science",
                    correct_answer: "H2O",
                    incorrect_answers: [
                        "CO2",
                        "NaCl",
                        "O2"
                    ],
                    question: "What is the chemical formula for water?",
                    difficulty: 'easy'
                },
                {
                    category: "Geography",
                    correct_answer: "Canada",
                    incorrect_answers: [
                        "Russia",
                        "China",
                        "United States"
                    ],
                    question: "Which country has the longest coastline?",
                    difficulty: 'medium'
                },
                {
                    category: "Entertainment",
                    correct_answer: "The Shawshank Redemption",
                    incorrect_answers: [
                        "The Godfather",
                        "Pulp Fiction",
                        "The Dark Knight"
                    ],
                    question: "Which movie tops IMDb's Top 250 list?",
                    difficulty: 'medium'
                },
                {
                    category: "Sports",
                    correct_answer: "Brazil",
                    incorrect_answers: [
                        "Germany",
                        "Italy",
                        "Argentina"
                    ],
                    question: "Which country has won the most FIFA World Cups?",
                    difficulty: 'hard'
                }
            ]
        }
    }
];

export const MockDataCustomTrivaTitles = [
    {
        title: "Movie Night Trivia",
        id: 65,
    },
    {
        title: "Coffee Shop Trivia",
        id: 2,
    },
    {
        title: "Talk Show Trivia",
        id: 3,
    }
]