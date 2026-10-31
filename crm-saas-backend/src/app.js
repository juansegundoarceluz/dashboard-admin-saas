const express = require("express");
const cors = require("cors");

const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const authRoutes = require("./routes/auth.routes");


const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/api/projects", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("🚀 API is running...");
});

module.exports = app;