const userService = require("../services/user.service");

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};

module.exports = {
    createUser,
    getUsers,
};