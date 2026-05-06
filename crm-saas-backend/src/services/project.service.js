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

const getProjects = async (userId) => {
    return await prisma.project.findMany({
        where: {
            userId: userId,  // solo los proyectos de este usuario
        },
        include: {
            tasks: true,
        },
    });
};

// ─── deleteProject ──────────────────────────────────────────────────────────
// Borra un proyecto SOLO si pertenece al usuario que lo pide. Esto es muy
// importante: nunca confiar en que el frontend mando bien los datos. Aunque
// el JWT diga "soy user 1", igual hay que verificar que el proyecto sea de
// user 1 antes de borrarlo, sino user 1 podria borrar proyectos ajenos
// pasando un id que no es suyo.
//
// Patron: deleteMany con where compuesto. Si no matchea (porque el proyecto
// no existe o es de otro user), borra 0 filas — devolvemos eso al controller
// para que decida si responder 404 o 204.

const deleteProject = async (projectId, userId) => {
    const result = await prisma.project.deleteMany({
        where: {
            id: projectId,
            userId: userId,
        },
    });
    return result.count; // 0 = no se borro nada, 1 = OK
};

module.exports = {
    createProject,
    getProjects,
    deleteProject,
};
