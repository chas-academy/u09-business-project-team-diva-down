"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteUser = exports.updateUser = exports.getAllusers = exports.getUser = void 0;
const User_model_1 = require("../models/User.model");
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ _id: "_id params is required! " });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        const user = yield User_model_1.User.findOne({ _id: new mongoose_1.Types.ObjectId(userId) }).select('-password');
        if (!user) {
            res.status(404).json({ message: 'No user found with that ID' });
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err });
        return;
    }
});
exports.getUser = getUser;
const getAllusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield User_model_1.User.find({}).select('-password');
        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ message: 'No users found!' });
        }
        res.status(200).json(allUsers);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetch All users", error: err });
        return;
    }
});
exports.getAllusers = getAllusers;
const saltRounds = 10;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ _id: "_id params is required!" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data submitted!" });
        }
        const user = yield User_model_1.User.findOne({ _id: new mongoose_1.Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that ID' });
        }
        const { name, email, password, eloScore, wins, total_matches } = req.body;
        if (name !== undefined)
            user.name = name;
        if (email !== undefined)
            user.email = email;
        if (password !== undefined) {
            const newHashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
            user.password = newHashedPassword;
        }
        if (eloScore !== undefined)
            user.eloScore = Number(eloScore);
        if (wins !== undefined)
            user.wins = Number(wins);
        if (total_matches !== undefined)
            user.total_matches = Number(total_matches);
        const updatedUser = yield user.save();
        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;
        return res.status(200).json({
            message: "Updated user successfully!",
            user: userToReturn
        });
    }
    catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            message: "Failed to update user",
            error
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ _id: "_id params is required! " });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }
        const user = yield User_model_1.User.findOne({ _id: new mongoose_1.Types.ObjectId(userId) });
        if (!user) {
            res.status(404).json({ message: "No User found with that ID!" });
            return;
        }
        yield user.deleteOne();
        res.status(200).json({ message: "User has been deleted", user });
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Failed to Update User", error: err });
        return;
    }
});
exports.deleteUser = deleteUser;
