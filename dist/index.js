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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("./db"));
const User_1 = require("./model/User");
const User_2 = require("./validations/User");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = __importDefault(require("./middleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
const SECRET = "mYSuperSecret";
// Sign-In Route
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required!" });
            return;
        }
        const user = yield User_1.UserModel.findOne({ username });
        if (!user) {
            res.status(400).json({ message: "Incorrect Username!" });
            return;
        }
        if (!user.password) {
            res.status(400).json({ message: "Password not set for this user!" });
            return;
        }
        const isPasswordMatched = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatched) {
            res.status(400).json({ message: "Incorrect Password!" });
            return;
        }
        const payload = { id: user._id, username: user.username };
        const token = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Sign-In Error:", error);
        res.status(500).json({ message: "Internal server error!" });
    }
}));
// Sign-Up Route
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required!" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        const parsedData = User_2.userSchema.parse(newUser);
        yield User_1.UserModel.create(parsedData);
        res.status(201).json({ message: "User signed up successfully!" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.errors });
            return;
        }
        if (error instanceof mongoose_1.default.Error) {
            res.status(409).json({ message: "User already exists!" });
            return;
        }
        console.error("Sign-Up Error:", error);
        res.status(500).json({ message: "Internal server error!" });
    }
}));
app.post("/api/v1/content", middleware_1.default, (req, res) => {
    const user = req.user; // Type-safe access to the `user` property
    res.status(200).json({ message: "Authorized access", user });
});
app.get("/api/v1/content", (req, res) => {
    res.status(501).json({ message: "Get content endpoint not implemented yet." });
});
app.delete("/api/v1/content", (req, res) => {
    res.status(501).json({ message: "Delete content endpoint not implemented yet." });
});
// Brain Share Routes (Placeholder)
app.post("/api/v1/brain/share", (req, res) => {
    res.status(501).json({ message: "Brain share endpoint not implemented yet." });
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
    res.status(501).json({ message: "Get brain share endpoint not implemented yet." });
});
// Start the Server
app.listen(3000, () => {
    console.log("Server Running on http://localhost:3000");
});
