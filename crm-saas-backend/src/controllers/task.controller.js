const taskService = require("../services/task.service");

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user.userId);
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof taskService.ProjectNotFoundError) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.error("Create task error:", error);
        res.status(500).json({ error: "Error creating task" });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks(req.user.userId);
        res.json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error);
        res.status(500).json({ error: "Error fetching tasks" });
    }
};

module.exports = {
    createTask,
    getTasks,
};
