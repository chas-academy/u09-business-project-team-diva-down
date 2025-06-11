import Header from "../components/common/header";
import Footer from "../components/common/footer";
import React, { useState } from "react";
import { MockDataCustomTrivaTitles } from '../MockData/MockDataGameLoop';

const CustomTrivia: React.FC = () => {
    const [toggleTriviaTable, setToggleTriviaTable] = useState(true);
    const [toggleCreateNewTrivia, setToggleCreateNewTrivia] = useState(false);
    const [TriviaTableContent, setTriviaTableContent] = useState(MockDataCustomTrivaTitles);
    const [NewTriviaListName, setNewTriviaListName] = useState('');
    const [toggleEditTriviaSpecList, setToggleEditTriviaSpecList] = useState(false);
    const [EditTriviaContent, setEditTriviaContent] = useState<EditTriviaTable>();
    const [toggleAddQuestion, setToggleAddQuestion] = useState(false);

    interface Questions {
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

    const toggleCancelFunctionAddQuestion = () => {
        setToggleAddQuestion(!toggleAddQuestion);
        // Clear UseState of edit form
    }

    const toggleFunctionAddQuestion = (id: number) => {
        console.log(id);
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

    const ToggleTrivia = () => {
        setToggleTriviaTable(!toggleTriviaTable);
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
                    <button onClick={ToggleTrivia}>Press Me</button>
                    {toggleTriviaTable && (
                        <>
                            <div className="custom_trivia_container">
                                <div className="header">
                                    <h1>Create Custom Trivia</h1>
                                    <button className="create-btn" onClick={ToggleCreateNewTrivia}>+ Create </button>
                                </div>
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
                                                        <button className="btn start-btn" value={data.id}>Start</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {toggleAddQuestion && (
                        <>
                            <div className="div">Hello</div>
                        </>
                    )}

                    {toggleEditTriviaSpecList && (
                        <>
                            <div className="edit_trivia_container">
                                <div className="header">
                                    <div className="title_container">
                                        <h1>{EditTriviaContent?.title || "Custom Trivia Title"}</h1>
                                        <span className="edit">Edit</span>
                                    </div>
                                    <div className="btn-container">
                                        <button 
                                            className="btn add_question"
                                            value={EditTriviaContent?.id} 
                                            onClick={() => {
                                                if (EditTriviaContent?.id) {
                                                    toggleFunctionAddQuestion(EditTriviaContent.id)
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
                                        {EditTriviaContent?.data.results.map((data) => {
                                            return (
                                                <>
                                                    <td>{data.question}</td>
                                                    <td>{data.category}</td>
                                                    <td>{data.difficulty}</td>
                                                    <td>
                                                        {data.correct_answer}
                                                        <ul>
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
                                                        <button className="btn edit-btn">Edit</button>
                                                        <button className="btn delete-btn">Delete</button>
                                                    </td>
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