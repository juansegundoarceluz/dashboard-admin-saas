const prisma = require("../config/prisma");

const createProject = async (data, userId) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            userId: userId,
        },
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