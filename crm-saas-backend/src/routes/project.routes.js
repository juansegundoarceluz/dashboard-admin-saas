const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Todas las rutas estan protegidas con auth. El middleware corre antes del
// controller; si no hay token o es invalido, responde 401 y no llama al
// controller. Eso se llama "middleware chain": Express ejecuta los handlers
// en orden y cada uno puede cortar la cadena con res.send / res.json.

router.post("/",      authMiddleware, projectController.createProject);
router.get("/",       authMiddleware, projectController.getProjects);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
