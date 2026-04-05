const projectService = require("../services/project.service");

const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: "Error creating project" });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: "Error fetching projects" });
    }
};

module.exports = {
    createProject,
    getProjects,
};