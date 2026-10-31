const { z } = require("zod");

// `userId` is deliberately NOT part of this schema: the owner always comes
// from the verified JWT, never from the request body.
const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  projectId: z.string().min(1, "projectId is required"),
  completed: z.boolean().optional(),
});

module.exports = { createTaskSchema };
