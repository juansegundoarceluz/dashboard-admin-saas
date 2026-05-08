const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createProjectSchema } = require("../schemas/project.schema");

// Orden de middlewares importa: primero auth (para tener req.user.userId),
// despues validate (para chequear el body). Cada uno puede cortar la cadena.
router.post(
    "/",
    authMiddleware,
    validate(createProjectSchema),
    projectController.createProject
);
router.get("/",       authMiddleware, projectController.getProjects);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
