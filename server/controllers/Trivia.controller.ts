import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import TriviaTable from "../models/question.model";

export const getTriviaTables = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const triviaTables = await TriviaTable.find({ userId });
        res.status(200).json(triviaTables);
    } catch (err) {
        res.status(500).json({ message: "Error fetching Trivia Tables", error: err });
    }
}

export const getTriviaTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const triviaTable = await TriviaTable.findById(id);
        
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        
        res.status(200).json(triviaTable);
    } catch (err) {
        res.status(500).json({ message: "Error fetching Trivia", error: err });
    }
}

export const createTriviaTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, title } = req.body;
        
        if (!userId || !title) {
            return res.status(400).json({ message: "userId and title are required" });
        }
        
        const newTriviaTable = new TriviaTable({
            userId,
            title,
            data: { results: [] }
        });
        
        await newTriviaTable.save();
        res.status(201).json(newTriviaTable);
    } catch (err) {
        res.status(500).json({ message: "Error creating Trivia Table", error: err });
    }
}

export const updateTriviaTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { action, questionData } = req.body;
        
        const triviaTable = await TriviaTable.findById(id);
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        
        switch (action) {
            case 'addQuestion':
                if (!questionData) {
                    return res.status(400).json({ message: "Question data is required" });
                }
                
                questionData.id = uuidv4();
                triviaTable.data.results.push(questionData);
                break;
                
            case 'updateQuestion':
                if (!questionData || !questionData.id) {
                    return res.status(400).json({ message: "Question data and ID are required" });
                }
                
                const questionIndex = triviaTable.data.results.findIndex(q => q.id === questionData.id);
                if (questionIndex === -1) {
                    return res.status(404).json({ message: "Question not found" });
                }
                
                triviaTable.data.results[questionIndex] = questionData;
                break;
                
            case 'updateTitle':
                if (!questionData || !questionData.title) {
                    return res.status(400).json({ message: "Title is required" });
                }
                triviaTable.title = questionData.title;
                break;
                
            default:
                return res.status(400).json({ message: "Invalid action" });
        }
        
        triviaTable.updatedAt = new Date();
        await triviaTable.save();
        res.status(200).json(triviaTable);
    } catch (err) {
        res.status(500).json({ message: "Error Updating Trivia", error: err });
    }
}


export const deleteTriviaTable = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedTable = await TriviaTable.findByIdAndDelete(id);
        
        if (!deletedTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        
        res.status(200).json({ message: "Trivia table deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error Deleting Trivia", error: err });
    }
}

export const deleteQuestion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, questionId } = req.params;
        
        const triviaTable = await TriviaTable.findById(id);
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        
        const initialLength = triviaTable.data.results.length;
        triviaTable.data.results = triviaTable.data.results.filter(q => q.id !== questionId);
        
        if (triviaTable.data.results.length === initialLength) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        triviaTable.updatedAt = new Date();
        await triviaTable.save();
        res.status(200).json(triviaTable);
    } catch (err) {
        res.status(500).json({ message: "Error Deleting Question", error: err });
    }
}