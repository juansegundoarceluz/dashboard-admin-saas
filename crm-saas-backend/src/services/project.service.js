const prisma = require("../config/prisma");

const createProject = async (data) => {
    return await prisma.project.create({
        data,
    });
};

const getProjects = async () => {
    return await prisma.project.findMany({
        include: {
            tasks: true,
        },
    });
};

module.exports = {
    createProject,
    getProjects,
};