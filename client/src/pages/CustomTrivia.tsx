import Header from "../components/common/header";
import Footer from "../components/common/footer";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouterContainer } from "../routes/RouteContainer";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Questions {
    id: string;
    category: string;
    correct_answer: string;
    incorrect_answers: string[];
    question: string;
    difficulty: "easy" | "medium" | "hard";
}

interface TriviaTable {
    _id: string;
    userId: string;
    title: string;
    data: {
        results: Questions[];
    };
    createdAt: string;
    updatedAt: string;
}

interface AuthUserData {
    id: string;
    name: string;
    email: string;
    eloScore?: number;
    wins?: number;
    total_matches?: number;
}

const CustomTrivia: React.FC = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    const [toggleTriviaTable, setToggleTriviaTable] = useState(true);
    const [toggleCreateNewTrivia, setToggleCreateNewTrivia] = useState(false);
    const [triviaTables, setTriviaTables] = useState<TriviaTable[]>([]);
    const [NewTriviaListName, setNewTriviaListName] = useState('');
    const [toggleEditTriviaSpecList, setToggleEditTriviaSpecList] = useState(false);
    const [EditTriviaContent, setEditTriviaContent] = useState<TriviaTable | null>(null);
    const [toggleAddQuestion, setToggleAddQuestion] = useState(false);
    const [toggleEditQuestion, settoggleEditQuestion] = useState(false);
    const [AuthUserData, setAuthUserData] = useState<AuthUserData | null>(null);
    const navigate = useNavigate();

    const [editingQuestion, setEditingQuestion] = useState<Questions | null>(null);
    const [addQuestion, setAddQuestion] = useState<Questions>({
        id: uuidv4(),
        category: '',
        correct_answer: '',
        incorrect_answers: ['', '', ''],
        question: '',
        difficulty: 'easy'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) return;
            
            const userData = JSON.parse(userDataString);
            try {
                const response = await axios.get(`${baseUrl}/user/${userData.id}`);
                setAuthUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (AuthUserData?.id) {
            fetchTriviaTables(AuthUserData.id);
        }
    }, [AuthUserData]);

    const fetchTriviaTables = async (userId: string) => {
        try {
            const response = await axios.get(`${baseUrl}/trivia/user/${userId}`);
            setTriviaTables(response.data);
        } catch (error) {
            console.error("Error fetching trivia tables:", error);
        }
    };

    const fetchTriviaTable = async (id: string) => {
        try {
            const response = await axios.get(`${baseUrl}/trivia/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching trivia table:", error);
            return null;
        }
    };

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

    const handleAddQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!addQuestion.question || !addQuestion.category || 
            !addQuestion.correct_answer || addQuestion.incorrect_answers.some(a => !a)) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!EditTriviaContent) return;

        try {
            await axios.put(`${baseUrl}/trivia/${EditTriviaContent._id}`, {
                action: 'addQuestion',
                questionData: addQuestion
            });
            
            const updatedTable = await fetchTriviaTable(EditTriviaContent._id);
            if (updatedTable) {
                setEditTriviaContent(updatedTable);
            }
            
            setAddQuestion({
                id: uuidv4(),
                category: '',
                correct_answer: '',
                incorrect_answers: ['', '', ''],
                question: '',
                difficulty: 'easy'
            });
            
            setToggleAddQuestion(false);
        } catch (error) {
            console.error("Error adding question:", error);
            alert('Failed to add question');
        }
    };

    const toggleCancelFunctionAddQuestion = () => {
        setToggleAddQuestion(!toggleAddQuestion);
        setAddQuestion({
            id: uuidv4(),
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

    const handleEditQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingQuestion || !EditTriviaContent) return;
        
        if (!addQuestion.question || !addQuestion.category || 
            !addQuestion.correct_answer || addQuestion.incorrect_answers.some(a => !a)) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            await axios.put(`${baseUrl}/trivia/${EditTriviaContent._id}`, {
                action: 'updateQuestion',
                questionData: addQuestion
            });
            
            const updatedTable = await fetchTriviaTable(EditTriviaContent._id);
            if (updatedTable) {
                setEditTriviaContent(updatedTable);
            }
            
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
        } catch (error) {
            console.error("Error updating question:", error);
            alert('Failed to update question');
        }
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

    const ToggleEditTrivia = async (id: string) => {
        try {
            const triviaTable = await fetchTriviaTable(id);
            if (triviaTable) {
                setEditTriviaContent(triviaTable);
                setToggleEditTriviaSpecList(true);
                setToggleTriviaTable(false);
            }
        } catch (error) {
            console.error("Error fetching trivia table:", error);
        }
    }

    const ToggleCreateNewTrivia = () => {
        setToggleCreateNewTrivia(!toggleCreateNewTrivia);
    }

    const InsertNewTriviaList = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!NewTriviaListName || !AuthUserData) return;
        
        try {
            const response = await axios.post(`${baseUrl}/trivia`, {
                userId: AuthUserData.id,
                title: NewTriviaListName
            });
            
            setTriviaTables(prev => [...prev, response.data]);
            setNewTriviaListName('');
            setToggleCreateNewTrivia(false);
        } catch (error) {
            console.error("Error creating trivia table:", error);
            alert('Failed to create trivia table');
        }
    }

    const deleteTriviaList = async (id: string) => {
        try {
            await axios.delete(`${baseUrl}/trivia/${id}`);
            setTriviaTables(prev => prev.filter(table => table._id !== id));
        } catch (error) {
            console.error("Error deleting trivia table:", error);
            alert('Failed to delete trivia table');
        }
    }

    const DeleteQuestion = async (id: string) => {
        if (!EditTriviaContent) return;
        
        try {
            await axios.delete(`${baseUrl}/trivia/${EditTriviaContent._id}/question/${id}`);
            
            const updatedTable = await fetchTriviaTable(EditTriviaContent._id);
            if (updatedTable) {
                setEditTriviaContent(updatedTable);
            }
            
            if (editingQuestion && editingQuestion.id === id) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert('Failed to delete question');
        }
    };

    const updateTriviaTitle = async (newTitle: string) => {
        if (!EditTriviaContent) return;
        
        try {
            await axios.put(`${baseUrl}/trivia/${EditTriviaContent._id}`, {
                action: 'updateTitle',
                questionData: { title: newTitle }
            });
            
            const updatedTable = await fetchTriviaTable(EditTriviaContent._id);
            if (updatedTable) {
                setEditTriviaContent(updatedTable);
            }
            
            setTriviaTables(prev => 
                prev.map(table => 
                    table._id === EditTriviaContent._id 
                        ? { ...table, title: newTitle } 
                        : table
                )
            );
        } catch (error) {
            console.error("Error updating title:", error);
            alert('Failed to update title');
        }
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

            return () => {
                dropdowns.forEach(dropdown => {
                    dropdown.removeEventListener('mouseenter', () => {});
                    dropdown.removeEventListener('mouseleave', () => {});
                });
            };
        };

        setupDropdowns();
    }, [EditTriviaContent?.data.results]);

    const HostLobby = (id: string) => {
        const AuthId = localStorage.getItem("token");
        if (!AuthId) {
            throw new Error("No Auth token found");
        }

        navigate(RouterContainer.CustomMultiplayer.replace(':id', AuthId.slice(0, 15)), 
            { state: { TriviaId: id } });
    };

    const JoinLobby = () => {
        const AuthId = localStorage.getItem("token");
        if (!AuthId) {
            throw new Error("No Auth token found");
        }

        navigate(RouterContainer.CustomMultiplayer.replace(':id', AuthId.slice(0, 15)));
    };

    return (
        <>
            <div className="CustomTrivia_Page">
                <Header />
                <main className="main">
                    {toggleCreateNewTrivia && (
                        <div className="createNewTriviaContainer">
                            <form onSubmit={InsertNewTriviaList}>
                                <label>Category Name:</label>
                                <input 
                                    type="text"
                                    className="user_input"
                                    value={NewTriviaListName}
                                    onChange={(e) => setNewTriviaListName(e.target.value)}
                                    required
                                />
                                <input type="submit" className="submit" value={'Send'}/>
                                <button className="cancel" onClick={ToggleCreateNewTrivia}>Cancel</button>
                            </form>
                        </div>
                    )}
                    
                    {toggleTriviaTable && (
                        <div className="custom_trivia_container">
                            <div className="header">
                                <h1>Create Custom Trivia</h1>
                                <button className="create-btn" onClick={ToggleCreateNewTrivia}>+ Create</button>
                            </div>
                            <div className="subheader">
                                <h4>Wanna join other lobbies? </h4>
                                <button className="create-btn" onClick={JoinLobby}>Connect</button>
                            </div>
                            <div className="table_container">
                                <table>
                                    <tbody>
                                        {triviaTables.map((data) => (
                                            <tr key={data._id}>
                                                <td><div className="title">{data.title}</div></td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button className="btn edit-btn" onClick={() => ToggleEditTrivia(data._id)}>Edit</button>
                                                        <button className="btn delete-btn" onClick={() => deleteTriviaList(data._id)}>Delete</button>
                                                        <button className="btn start-btn" onClick={() => HostLobby(data._id)}>Start</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {toggleAddQuestion && (
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
                    )}
                    
                    {toggleEditQuestion && editingQuestion && (
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
                    )}

                    {toggleEditTriviaSpecList && EditTriviaContent && (
                        <div className="edit_trivia_container">
                            <div className="header">
                                <div className="title_container">
                                    <input
                                        type="text"
                                        value={EditTriviaContent.title}
                                        onChange={(e) => updateTriviaTitle(e.target.value)}
                                        className="title-input"
                                    />
                                </div>
                                <div className="btn-container">
                                    <button 
                                        className="btn add_question"
                                        onClick={toggleFunctionAddQuestion}
                                    >
                                        Add Question
                                    </button>
                                    <button className="btn back" onClick={ToggleBackFromEditTrivia}>Back</button>
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
                                    {EditTriviaContent.data.results.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.question}</td>
                                            <td>{data.category}</td>
                                            <td>{data.difficulty}</td>
                                            <td id="dropdown" className="correct_option">
                                                {data.correct_answer}
                                                <ul className="other_options">
                                                    {data.incorrect_answers.map((option, i) => (
                                                        <li key={i}>{option}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>
                                                <div className="btn_container">
                                                    <button className="btn edit-btn" onClick={() => toggleFunctionEditQuestion(data.id)}>Edit</button>
                                                    <button className="btn delete-btn" onClick={() => DeleteQuestion(data.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default CustomTrivia;