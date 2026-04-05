const taskService = require("../services/task.service");

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error creating task" });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
};

module.exports = {
    createTask,
    getTasks,
};