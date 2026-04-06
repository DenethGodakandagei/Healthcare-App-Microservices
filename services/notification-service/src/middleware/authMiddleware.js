import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

            req.user = await User.findById(decoded.id).select("-password");

            // Lazy sync: create user placeholder if not in notification_db yet
            if (!req.user) {
                try {
                    req.user = await User.create({
                        _id: decoded.id,
                        username: decoded.username || "User",
                        email: decoded.email || `user_${decoded.id}@app.local`,
                        password: "n/a",
                    });
                } catch (createErr) {
                    // If duplicate key (race condition), just fetch it
                    req.user = await User.findById(decoded.id).select("-password");
                }
            }

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Auth error:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
});

export { protect };
