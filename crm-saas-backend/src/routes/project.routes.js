const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/create", projectController.createProject);
router.get("/", projectController.getProjects);
router.post("/create", authMiddleware, projectController.createProject);

router.get("/", authMiddleware, projectController.getProjects);


module.exports = router;