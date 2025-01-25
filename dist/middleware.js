"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = "mYSuperSecret";
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Authorization header is missing!" });
            return;
        }
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.substring(7)
            : authHeader;
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        // Attach decoded payload to the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Invalid or expired token!" });
        return;
    }
}
exports.default = authMiddleware;
