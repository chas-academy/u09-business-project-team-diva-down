import Header from "../components/common/header";
import Footer from "../components/common/footer";
import React, { useEffect, useState } from "react";
import { MockDataCustomTrivaTitles } from '../MockData/MockDataGameLoop'; 
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouteContainer";

const CustomTrivia: React.FC = () => {
    const [toggleTriviaTable, setToggleTriviaTable] = useState(true);
    const [toggleCreateNewTrivia, setToggleCreateNewTrivia] = useState(false);
    const [TriviaTableContent, setTriviaTableContent] = useState(MockDataCustomTrivaTitles);
    const [NewTriviaListName, setNewTriviaListName] = useState('');
    const [toggleEditTriviaSpecList, setToggleEditTriviaSpecList] = useState(false);
    const [EditTriviaContent, setEditTriviaContent] = useState<EditTriviaTable>();
    const [toggleAddQuestion, setToggleAddQuestion] = useState(false);
    const [toggleEditQuestion, settoggleEditQuestion] = useState(false);
    const navigate = useNavigate();

    // Consts regarding adding / Editing questions
    
    const [editingQuestion, setEditingQuestion] = useState<Questions | null>(null);
    const [addQuestion, setAddQuestion] = useState<Questions>({
        id: uuidv4(),
        category: '',
        correct_answer: '',
        incorrect_answers: ['', '', ''],
        question: '',
        difficulty: 'easy'
    });

    interface Questions {
        id: string;
        category: string;
        correct_answer: string;
        incorrect_answers: string[];
        question: string;
        difficulty: "easy" | "medium" | "hard";
    }

    interface EditTriviaTable {
        title: string;
        id: number;
        data: {
            results: Questions[];
        };
    }


    // Handler functions regarding the adding of question
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddQuestion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIncorrectAnswerChange = (index: number, value: string) => {
        setAddQuestion(prev => {
            const newIncorrectAnswers = [...prev.incorrect_answers];
            newIncorrectAnswers[index] = value;
            return {
                ...prev,
                incorrect_answers: newIncorrectAnswers
            };
        });
    };

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddQuestion(prev => ({
            ...prev,
            difficulty: e.target.value as "easy" | "medium" | "hard"
        }));
    };

    const handleAddQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate the form data
        if (!addQuestion.question || !addQuestion.category || 
            !addQuestion.correct_answer || addQuestion.incorrect_answers.some(a => !a)) {
            alert('Please fill in all fields');
            return;
        }
        
        // // Add the new question to your state
        // setAddQuestion(prev => [...prev, addQuestion]);
        
        // If you want to also add it to EditTriviaContent
        if (EditTriviaContent) {
            setEditTriviaContent(prev => ({
                ...prev!,
                data: {
                    results: [...prev!.data.results, addQuestion]
                }
            }));
        }
        
        // Reset the form
        setAddQuestion({
            id: uuidv4(),
            category: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
            question: '',
            difficulty: 'easy'
        });
        
        // Close the form
        setToggleAddQuestion(false);
    };

    const toggleCancelFunctionAddQuestion = () => {
        setToggleAddQuestion(!toggleAddQuestion);
        setAddQuestion({
            id: '',
            category: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
            question: '',
            difficulty: 'easy'
        });
    }

    const toggleFunctionEditQuestion = (id: string) => {
        if (EditTriviaContent) {
            const questionToEdit = EditTriviaContent.data.results.find(q => q.id === id);
            if (questionToEdit) {
                setEditingQuestion(questionToEdit);
                setAddQuestion(questionToEdit);
                settoggleEditQuestion(true);
            }
        }
    };

    const handleEditQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingQuestion) return;
        
        if (!addQuestion.question || !addQuestion.category || 
            !addQuestion.correct_answer || addQuestion.incorrect_answers.some(a => !a)) {
            alert('Please fill in all fields');
            return;
        }
        
        setEditTriviaContent(prev => {
            if (!prev) return prev;
            
            return {
                ...prev,
                data: {
                    results: prev.data.results.map(question => 
                        question.id === editingQuestion.id ? addQuestion : question
                    )
                }
            };
        });
        
        setAddQuestion({
            id: uuidv4(),
            category: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
            question: '',
            difficulty: 'easy'
        });
        setEditingQuestion(null);
        settoggleEditQuestion(false);
    };

    const handleCancelEdit = () => {
        setAddQuestion({
            id: uuidv4(),
            category: '',
            correct_answer: '',
            incorrect_answers: ['', '', ''],
            question: '',
            difficulty: 'easy'
        });
        setEditingQuestion(null);
        settoggleEditQuestion(false);
    };

    const toggleFunctionAddQuestion = () => {
        setToggleAddQuestion(!toggleAddQuestion);
    }

    const ToggleBackFromEditTrivia = () => {
        setToggleEditTriviaSpecList(!toggleEditTriviaSpecList);
        setToggleTriviaTable(!toggleTriviaTable);
    }

    const ToggleEditTrivia = (id: number) => {
        setToggleEditTriviaSpecList(!toggleEditTriviaSpecList);
        setToggleTriviaTable(!toggleTriviaTable);
        console.log(id);
        const SpecificTriva = TriviaTableContent.find(data => data.id === id);
        if (SpecificTriva) {
            const editTriviaData: EditTriviaTable = {
                title: SpecificTriva.title,
                id: SpecificTriva.id,
                data: {
                    results: []
                }
            };

            setEditTriviaContent(editTriviaData);

        } else {

            const emptyTrivaDataSet: EditTriviaTable = {
                title: '',
                id: 0,
                data: {
                    results: []
                }
            }
            setEditTriviaContent(emptyTrivaDataSet);
        }
    }

    const ToggleCreateNewTrivia = () => {
        setToggleCreateNewTrivia(!toggleCreateNewTrivia);
    }

    const InsertNewTriviaList = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(NewTriviaListName);
        const newId = MockDataCustomTrivaTitles.length + 1

        const newInput = {
            id: newId,
            title: NewTriviaListName,
        }

        if(NewTriviaListName) {
            setTriviaTableContent([...MockDataCustomTrivaTitles, newInput])
        }
        setToggleCreateNewTrivia(false);
    }

    const deleteTriviaList = (id?: number) => {
        console.log(id);
        setTriviaTableContent(prev => prev.filter(list => list.id !== id));
    }

    const DeleteQuestion = (id?: string) => {
        setEditTriviaContent(prev => {
            if (!prev) return;

            if (editingQuestion && editingQuestion.id === id) {



                handleCancelEdit();
            }

            return {
                ...prev,
                data: {
                    results: prev.data.results.filter(questions => questions.id !== id)
                }
            };
        });
    };

    useEffect(() => {
    const setupDropdowns = () => {
        const dropdowns = document.querySelectorAll('.correct_option');
        
        dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            const optionsMenu = dropdown.querySelector('.other_options') as HTMLElement;
            if (optionsMenu) optionsMenu.style.display = 'block';
        });

        dropdown.addEventListener('mouseleave', () => {
            const optionsMenu = dropdown.querySelector('.other_options') as HTMLElement;
            if (optionsMenu) optionsMenu.style.display = 'none';
        });
        });

        // Cleanup function
        return () => {
        dropdowns.forEach(dropdown => {
            dropdown.removeEventListener('mouseenter', () => {});
            dropdown.removeEventListener('mouseleave', () => {});
        });
        };
    };

    setupDropdowns();
    }, [EditTriviaContent?.data.results]);


    // Host Lobby Functions, will be expanded on when entering the websocket


    const HostLobby = (id: number) => {

        const TriviaId = id;

        const AuthId = localStorage.getItem("token");

        if (!AuthId) {
            throw new Error("No Auth token found");
        }

        navigate(RouterContainer.CustomMultiplayer.replace(':id', AuthId.slice(0, 15)), 
            { state: 
                { 
                    TriviaId,
                }
            })
    };


    return (
        <>
            <div className="CustomTrivia_Page">
                <Header />
                <main className="main">
                    {toggleCreateNewTrivia && (
                        <>
                            <div className="createNewTriviaContainer">
                                <form onSubmit={InsertNewTriviaList}>
                                    <label>Category Name:</label>
                                    <input 
                                        type="text"
                                        className="user_input"
                                        value={NewTriviaListName}
                                        onChange={(e) => setNewTriviaListName(e.target.value)}
                                    />
                                    <input type="submit" className="submit" value={'Send'}/>
                                    <button className="cancel" onClick={ToggleCreateNewTrivia}>Cancel</button>
                                </form>
                            </div>
                        </>
                    )}
                    {toggleTriviaTable && (
                        <>
                            <div className="custom_trivia_container">
                                <div className="header">
                                    <h1>Create Custom Trivia</h1>
                                    <button className="create-btn" onClick={ToggleCreateNewTrivia}>+ Create </button>
                                </div>
                                <div className="table_container">
                                    <table>
                                        <tbody>
                                        {TriviaTableContent.map((data) => {
                                            return (
                                                <tr key={data.id}>
                                                    <td> <div className="title">{data.title}</div></td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button className="btn edit-btn" value={data.id} onClick={() => ToggleEditTrivia(data.id)}>Edit</button>
                                                            <button className="btn delete-btn" value={data.id} onClick={() => deleteTriviaList(data.id)}>Delete</button>
                                                            <button className="btn start-btn" value={data.id} onClick={() => HostLobby(data.id)}>Start</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                    {toggleAddQuestion && (
                        <>
                            <div className="add_question_container">
                                <div className="header">
                                    <h1>Add Question</h1>
                                </div>
                                <div className="form-container">
                                    <form onSubmit={handleAddQuestionSubmit}>
                                        <div className="form_group">
                                            <label htmlFor="">Question</label>
                                            <input 
                                                type="text" 
                                                id="question"
                                                name="question"
                                                value={addQuestion.question}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form_group">
                                            <label htmlFor="">Category</label>
                                            <input 
                                                type="text"
                                                id="category"
                                                name="category"
                                                value={addQuestion.category}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form_group">
                                            <label htmlFor="">Difficulty</label>
                                            <div className="difficulty-options">
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-easy">Easy</label>
                                                    <input 
                                                        type="radio"
                                                        id="difficulty-easy" 
                                                        name="difficulty" 
                                                        value="easy"
                                                        checked={addQuestion.difficulty === 'easy'}
                                                        onChange={handleDifficultyChange}
                                                    />
                                                </div>
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-medium">Medium</label>
                                                    <input 
                                                        type="radio" 
                                                        id="difficulty-medium" 
                                                        name="difficulty" 
                                                        value="medium"
                                                        checked={addQuestion.difficulty === 'medium'}
                                                        onChange={handleDifficultyChange} 
                                                    />
                                                </div>
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-hard">Hard</label>
                                                    <input 
                                                        type="radio" 
                                                        id="difficulty-hard" 
                                                        name="difficulty" 
                                                        value="hard"
                                                        checked={addQuestion.difficulty === 'hard'}
                                                        onChange={handleDifficultyChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_group">
                                            <label>Options</label>
                                            <div className="options_container">
                                                <div className="correct_answer">
                                                <div className="correct">Right Answer</div>
                                                    <input 
                                                        type="text" 
                                                        id="correct_answer"
                                                        name="correct_answer"
                                                        value={addQuestion.correct_answer}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                {addQuestion.incorrect_answers.map((answer, index) => (
                                                    <div className="incorrect_answer" key={index}>
                                                        <div className="incorrect">Wrong Answer {index + 1}</div>
                                                        <input 
                                                            type="text" 
                                                            value={answer}
                                                            onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form_actions">
                                            <button className="form-btn cancel" onClick={() => toggleCancelFunctionAddQuestion()}>Cancel</button>
                                            <button className="form-btn save">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                    {toggleEditQuestion && editingQuestion && (
                        <>
                            <div className="add_question_container">
                                <div className="header">
                                    <h1>Edit Question</h1>
                                </div>
                                <div className="form-container">
                                    <form onSubmit={handleEditQuestionSubmit}>
                                        <div className="form_group">
                                            <label htmlFor="">Question</label>
                                            <input 
                                                type="text" 
                                                id="question"
                                                name="question"
                                                value={addQuestion.question}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form_group">
                                            <label htmlFor="">Category</label>
                                            <input 
                                                type="text"
                                                id="category"
                                                name="category"
                                                value={addQuestion.category}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form_group">
                                            <label htmlFor="">Difficulty</label>
                                            <div className="difficulty-options">
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-easy">Easy</label>
                                                    <input 
                                                        type="radio"
                                                        id="difficulty-easy" 
                                                        name="difficulty" 
                                                        value="easy"
                                                        checked={addQuestion.difficulty === 'easy'}
                                                        onChange={handleDifficultyChange}
                                                    />
                                                </div>
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-medium">Medium</label>
                                                    <input 
                                                        type="radio" 
                                                        id="difficulty-medium" 
                                                        name="difficulty" 
                                                        value="medium"
                                                        checked={addQuestion.difficulty === 'medium'}
                                                        onChange={handleDifficultyChange} 
                                                    />
                                                </div>
                                                <div className="difficulty-option">
                                                    <label htmlFor="difficulty-hard">Hard</label>
                                                    <input 
                                                        type="radio" 
                                                        id="difficulty-hard" 
                                                        name="difficulty" 
                                                        value="hard"
                                                        checked={addQuestion.difficulty === 'hard'}
                                                        onChange={handleDifficultyChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form_group">
                                            <label>Options</label>
                                            <div className="options_container">
                                                <div className="correct_answer">
                                                <div className="correct">Right Answer</div>
                                                    <input 
                                                        type="text" 
                                                        id="correct_answer"
                                                        name="correct_answer"
                                                        value={addQuestion.correct_answer}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                {addQuestion.incorrect_answers.map((answer, index) => (
                                                    <div className="incorrect_answer" key={index}>
                                                        <div className="incorrect">Wrong Answer {index + 1}</div>
                                                        <input 
                                                            type="text" 
                                                            value={answer}
                                                            onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="form_actions">
                                            <button className="form-btn cancel" onClick={handleCancelEdit}>Cancel</button>
                                            <button className="form-btn save">Save Changes</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}

                    {toggleEditTriviaSpecList && (
                        <>
                            <div className="edit_trivia_container">
                                <div className="header">
                                    <div className="title_container">
                                        <h1>{EditTriviaContent?.title || "Custom Trivia Title"}</h1>
                                    </div>
                                    <div className="btn-container">
                                        <button 
                                            className="btn add_question"
                                            value={EditTriviaContent?.id} 
                                            onClick={() => {
                                                if (EditTriviaContent?.id) {
                                                    toggleFunctionAddQuestion()
                                                }
                                            }}
                                            >
                                                Add Question
                                            </button>
                                        <button 
                                            className="btn back" 
                                            onClick={ToggleBackFromEditTrivia}>Back</button>
                                    </div>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Question</th>
                                            <th>Category</th>
                                            <th>Difficulty</th>
                                            <th>Options</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {EditTriviaContent?.data.results.map((data, index) => {
                                            return (
                                                <>
                                                    <tr key={index}>
                                                        <td>{data.question}</td>
                                                        <td>{data.category}</td>
                                                        <td>{data.difficulty}</td>
                                                        <td id="dropdown" className="correct_option">
                                                            {data.correct_answer}
                                                            <ul className="other_options">
                                                            {data.incorrect_answers.map((options) => {
                                                                return (
                                                                    <>
                                                                        <li>{options}</li>
                                                                    </>
                                                                )
                                                            })}
                                                            </ul>
                                                        </td>
                                                        <td>
                                                            <div className="btn_container">
                                                                <button className="btn edit-btn" onClick={() => toggleFunctionEditQuestion(data.id)}>Edit</button>
                                                                <button className="btn delete-btn" onClick={() => DeleteQuestion(data.id)}>Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}


                </main>
                <Footer />
            </div>
        </>
    );
};

export default CustomTrivia;