const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createTaskSchema } = require("../schemas/task.schema");

// Every task route requires a valid JWT.
router.use(authMiddleware);

router.post("/create", validate(createTaskSchema), taskController.createTask);
router.get("/", taskController.getTasks);

module.exports = router;
