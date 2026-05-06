const projectService = require("../services/project.service");

const createProject = async (req, res) => {
    try {
        const project = await projectService.createProject(
            req.body,
            req.user.userId
        );
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: "Error creating project" });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await projectService.getProjects(req.user.userId);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: "Error fetching projects" });
    }
};

// ─── deleteProject ──────────────────────────────────────────────────────────
// Maneja DELETE /api/projects/:id
//   - req.params.id      = el id que viene en la URL (Express lo parsea solo)
//   - req.user.userId    = lo metio el authMiddleware tras verificar el JWT
//
// Status codes que devuelve:
//   - 204 No Content    -> exito, sin body. Convencion para DELETE OK.
//   - 404 Not Found     -> el proyecto no existe o no es del usuario.
//   - 500 Server Error  -> algo se rompio del lado nuestro.
//
// Por que 204 y no 200 con body: REST convention. DELETE exitoso no necesita
// devolver el recurso borrado. El frontend ya sabe cual era.

const deleteProject = async (req, res) => {
    try {
        const count = await projectService.deleteProject(
            req.params.id,
            req.user.userId
        );

        if (count === 0) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting project" });
    }
};

module.exports = {
    createProject,
    getProjects,
    deleteProject,
};
