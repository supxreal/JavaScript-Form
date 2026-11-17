import express from "express";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });
const { TURSO_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_URL and TURSO_AUTH_TOKEN must be configured");
}

const db = createClient({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN
});

const usersRouter = express.Router();
usersRouter.use(express.json());

usersRouter.get("/", async (req, res) => {
    try {
        const result = await db.execute("select * from users");
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "404 Not found"
            })
        }
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({
            error: "500 Interval server error"
        })
    }
})

usersRouter.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "400 Invalid user ID"
            })
        }

        const result = await db.execute({
            sql: "select * from users where userID = ?",
            args: [id]
        })

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "404 Not found"
            })
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            error: "500 Interval server error"
        })
    }
})

usersRouter.post("/", async (req, res) => {
    try {
        const { fullname, age, address, gender, interest, infomation } = req.body;
        if (!fullname || !age || !address || !gender || !interest) {
            return res.status(400).json({
                error: "404 Bad request"
            })
        }

        const result = await db.execute({
            sql: "INSERT INTO users (fullname, age, address, gender, interest, infomation) VALUES (?, ?, ?, ?, ?, ?)",
            args: [fullname, age, address, gender, interest, infomation || ""]
        })

        res.status(201).json({
            message: "User created",
            userID: Number(result.lastInsertRowid)
        })

    } catch (error) {
        res.status(500).json({
            error: "500 Internal server error"
        })
    }
})

usersRouter.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { fullname, age, address, gender, interest, infomation } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                error: "400 Invalid user ID"
            })
        }

        const result = await db.execute({
            sql: "UPDATE users SET fullname = ?, age = ?, address = ?, gender = ?, interest = ?, infomation = ? WHERE userID = ?",
            args: [fullname, age, address, gender, interest, infomation || "", id]
        })
        if (result.rowsAffected === 0) {
            return res.status(404).json({
                error: "404 Not found"
            })
        }

        res.status(200).json({
            message: "User updated"
        })

    } catch (error) {
        res.status(500).json({
            error: "500 Internal server error"
        })
    }
})


usersRouter.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "400 Invalid user ID"
            })
        }

        const result = await db.execute({
            sql: "DELETE FROM users WHERE userID = ?",
            args: [id]
        })
        if (result.rowsAffected === 0) {
            return res.status(404).json({
                error: "404 Not found"
            })
        }

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "500 Internal server error"
        })
    }
})

export default usersRouter;
