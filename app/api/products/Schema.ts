import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  IsAvailable: z.boolean().optional()
});

export default schema;