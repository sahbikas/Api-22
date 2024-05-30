const {z, date} =require("zod");
let registerSchema = z.object({
    name: z.string().regex(/^[^0-9][a-zA-z\s]+$/).max(50).min(2).nonempty(),
    email: z.string().email().nonempty(),
    role: z.string().regex(/customer|seller/).nonempty(),
    address: z.string().nonempty(),
    phone: z.string().regex(/^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)

 })
 let registerAdminTooSchema = z.object({
   name: z.string().regex(/^[^0-9][a-zA-z\s]+$/).max(50).min(2).nonempty(),
   email: z.string().email().nonempty(),
   role: z.string().regex(/customer|seller|admin/).nonempty(),
   address: z.string().nonempty(),
   phone: z.string().regex(/^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)

})
let updateUserSchema = z.object({
   name: z.string().regex(/^[^0-9][a-zA-z\s]+$/).max(50).min(2).nonempty(),
   
   role: z.string().regex(/customer|seller|admin/).nonempty(),
   address: z.string().nonempty(),
   phone: z.string().regex(/^(\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)

})
 let loginSchema = z.object({
   email: z.string().email().nonempty(),
   password: z.string().nonempty()
 })

let forgetPasswordSchema = z.object({
   email: z.string().email().nonempty(),
})

 let userActivationSchema = z.object({
   password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/),
   confirmPassword: z.string().nonempty()
}).refine((data) => data.password === data.confirmPassword, {
   
   message: "Passwords don't match",
   path: ["confirmPassword"]
});

 module.exports = {
    registerSchema,
   userActivationSchema,
   loginSchema,
   registerAdminTooSchema,
   updateUserSchema,
   forgetPasswordSchema
 }



 // s84VWZojYZ6kBBsu

 // sahbikash301
 //mongodb://127.0.0.1:27017/
 //db.users.insertOne({name: "bikash", email: "sahbikash301@gmail.com", role: "admin", address: "nepal", phone: 9827807046});
 //db.users.insertMany([{name: "rakesh", email: "onesahbikash301@gmail.com", role: "admin", address: "jankpur", phone: 9827807046},
 //{name: "arbaaz", email: "twosahbikash301@gmail.com", role: "admin", address: "kathmandu", phone: 9827807046}]);