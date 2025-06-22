"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.deleteTriviaTable = exports.updateTriviaTable = exports.createTriviaTable = exports.getTriviaTable = exports.getTriviaTables = void 0;
const uuid_1 = require("uuid");
const question_model_1 = __importDefault(require("../models/question.model"));
const getTriviaTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const triviaTables = yield question_model_1.default.find({ userId });
        res.status(200).json(triviaTables);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching Trivia Tables", error: err });
    }
});
exports.getTriviaTables = getTriviaTables;
const getTriviaTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const triviaTable = yield question_model_1.default.findById(id);
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        res.status(200).json(triviaTable);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching Trivia", error: err });
    }
});
exports.getTriviaTable = getTriviaTable;
const createTriviaTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title } = req.body;
        if (!userId || !title) {
            return res.status(400).json({ message: "userId and title are required" });
        }
        const newTriviaTable = new question_model_1.default({
            userId,
            title,
            data: { results: [] }
        });
        yield newTriviaTable.save();
        res.status(201).json(newTriviaTable);
    }
    catch (err) {
        res.status(500).json({ message: "Error creating Trivia Table", error: err });
    }
});
exports.createTriviaTable = createTriviaTable;
const updateTriviaTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { action, questionData } = req.body;
        const triviaTable = yield question_model_1.default.findById(id);
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        switch (action) {
            case 'addQuestion':
                if (!questionData) {
                    return res.status(400).json({ message: "Question data is required" });
                }
                questionData.id = (0, uuid_1.v4)();
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
        yield triviaTable.save();
        res.status(200).json(triviaTable);
    }
    catch (err) {
        res.status(500).json({ message: "Error Updating Trivia", error: err });
    }
});
exports.updateTriviaTable = updateTriviaTable;
const deleteTriviaTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTable = yield question_model_1.default.findByIdAndDelete(id);
        if (!deletedTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        res.status(200).json({ message: "Trivia table deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error Deleting Trivia", error: err });
    }
});
exports.deleteTriviaTable = deleteTriviaTable;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, questionId } = req.params;
        const triviaTable = yield question_model_1.default.findById(id);
        if (!triviaTable) {
            return res.status(404).json({ message: "Trivia table not found" });
        }
        const initialLength = triviaTable.data.results.length;
        triviaTable.data.results = triviaTable.data.results.filter(q => q.id !== questionId);
        if (triviaTable.data.results.length === initialLength) {
            return res.status(404).json({ message: "Question not found" });
        }
        triviaTable.updatedAt = new Date();
        yield triviaTable.save();
        res.status(200).json(triviaTable);
    }
    catch (err) {
        res.status(500).json({ message: "Error Deleting Question", error: err });
    }
});
exports.deleteQuestion = deleteQuestion;
