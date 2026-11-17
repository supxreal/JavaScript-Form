import express from "express";
import usersRouter from "./users.js";
import cors from "cors";

const host = "0.0.0.0";
const port = 8000;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("server is running...");
})

app.use("/users", usersRouter);

app.listen(port, host, () => {
    console.log(`server is running at ${host}:${port}...`);
})
