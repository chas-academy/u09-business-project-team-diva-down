import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useState } from "react";
import { MockDataCustomTrivaTitles } from '../MockData/MockDataGameLoop';

const CustomTrivia: React.FC = () => {
    const [toggleTriviaTable, setToggleTriviaTable] = useState(true);
    const [toggleCreateNewTrivia, setToggleCreateNewTrivia] = useState(false);
    const [TriviaTableContent, setTriviaTableContent] = useState(MockDataCustomTrivaTitles);

    const ToggleTrivia = () => {
        setToggleTriviaTable(!toggleTriviaTable);
    }

    const ToggleCreateNewTrivia = () => {
        setToggleCreateNewTrivia(!toggleCreateNewTrivia);
    }


    return (
        <>
            <div className="CustomTrivia_Page">
                <Header />
                <main className="main">
                    {toggleCreateNewTrivia && (
                        <>
                            <div className="createNewTriviaContainer">
                                <form>
                                    <label>Category Name:</label>
                                    <input type="text" className="user_input"/>
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
                                    {TriviaTableContent.map((data) => {
                                        return (
                                            <tr>
                                                <td> <div className="title">{data.title}</div></td>
                                                <td>
                                                    <div className="btn-group">
                                                        <button className="btn edit-btn" value={data.id}>Edit</button>
                                                        <button className="btn delete-btn" value={data.id}>Delete</button>
                                                        <button className="btn start-btn" value={data.id}>Start</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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