const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔐 protegidas con auth
router.post("/", authMiddleware, projectController.createProject);
router.get("/", authMiddleware, projectController.getProjects);

module.exports = router;