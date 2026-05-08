const { z } = require("zod");

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(500).optional(),
});

module.exports = { createProjectSchema };
