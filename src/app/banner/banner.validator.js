const {z} = require("zod")

const BannerCreateSchema = z.object({
    title: z.string().nonempty(),
    link: z.string().url().nonempty(),
    position: z.string().regex(/\d/).default(1).optional(),
    status: z.string().regex(/active|inactive/).nonempty().default('inactive')
})

const BannerUpdateSchema = z.object({
    title: z.string().nonempty(),
    link: z.string().url().nonempty(),
    status: z.string().regex(/active|inactive/).nonempty().default('inactive')
})


module.exports = {
    BannerCreateSchema,
    BannerUpdateSchema
}