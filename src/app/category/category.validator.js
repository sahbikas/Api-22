const {z} = require("zod")

const CategoryCreateSchema = z.object({
    title: z.string().nonempty(),
    description: z.string(),
    parent: z.string(),
    brands: z.string(),
    status: z.string().regex(/active|inactive/).nonempty().default('inactive')
})

const CategoryUpdateSchema = z.object({
    title: z.string().nonempty(),
    description: z.string(),
    parent: z.string(),
    brands: z.string(),
    slug: z.string(),
    status: z.string().regex(/active|inactive/).nonempty().default('inactive')
})


module.exports = {
    CategoryCreateSchema,
    CategoryUpdateSchema
}