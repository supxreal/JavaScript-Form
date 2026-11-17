import express from "express";
import usersRouter from "./users.js";
import cors from "cors";
import "dotenv/config";

// Main server
const host = "0.0.0.0";
const port = Number(process.env.PORT) || 8000;
const app = express();
app.use(express.json());

const allowOrigins = [
    process.env.ORIGIN_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.use(cors({
    origin: allowOrigins
}));

app.get("/", (req, res) => {
    res.send("server is running...");
})

app.use("/users", usersRouter);

app.listen(port, host, () => {
    console.log(`server is running at ${host}:${port}...`);
})
