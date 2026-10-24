const prisma = require("../config/prisma");

class ProjectNotFoundError extends Error {
    constructor() {
        super("Project not found");
        this.name = "ProjectNotFoundError";
    }
}

// Creates a task only if the target project belongs to the user. A project
// owned by someone else is reported exactly like a project that doesn't exist.
const createTask = async ({ title, projectId, completed }, userId) => {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        select: { id: true },
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    return await prisma.task.create({
        data: {
            title,
            projectId,
            ...(completed !== undefined && { completed }),
        },
    });
};

// Only the tasks that live inside the user's own projects.
const getTasks = async (userId) => {
    return await prisma.task.findMany({
        where: {
            project: {
                userId: userId,
            },
        },
        include: {
            project: true,
        },
    });
};

module.exports = {
    createTask,
    getTasks,
    ProjectNotFoundError,
};
