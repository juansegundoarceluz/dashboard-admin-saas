const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

// Middleware chain en accion: validate corre ANTES del controller.
// Si el body no matchea el schema -> 400 sin llegar al controller.
router.post("/register", validate(registerSchema), authController.register);
router.post("/login",    validate(loginSchema),    authController.login);

module.exports = router;
