const express = require("express")
const app = express()
/*
app.get('/', (req, res) => {
    console.log("i am here");
    res.json({
        
        result: "i am in .get()"
        
    })
});

app.post("/", (req, res) => {
    console.log("i am post")
    res.json({
         result: "i am in .post()"
    })
})

app.get("/about", (req, res) => {
    res.json({
        result: {
            content: "this is about containt",
            memberList: [
                {
                    id: 2,
                    name: "bikash sah",
                    postion: "ceo",
                    address: "jankpur"
                }
            ]
        }
    })
})

app.get('/:catSlug/:prodSlug/:prodId', (req, res) => {
    let {catSlug, prodSlug, prodId} = req.params;
    let query = req.query;
    //let catSlug = params.catSlug
    res.json({
         result: {catSlug, prodSlug, prodId, query},
         msg: "success",
         meta: null

    })
})
*/
app.get('/',(request,response)=>{
     
    response.json({
        result:"list of users",
        msg:"list of users",
        
    })
})
app.post('/',(request,response)=>{
     
    response.json({
        result:"list detail",
        msg:"list login",
        
    })
})
app.post('/',(request,response)=>{
     
    response.json({
        result:"list detail",
        msg:"list register",
        
    })
})
/*
task 1
in express definre the following routes with proper responsae (set yourself);
set a get request for list of all the users with endpoint set to  => /users
e.g => output => json => {result: "list of users"}, {result: [], msg: "list of users"}
set a post reuest for the login endpoint should be => login
e.g => output => json => {result: "list detail"}, {result: [], msg: "list login"}
set a post reuest for register endpoint should be => /register
e.g => output => json => {result: "list detail"}, {result: [], msg: "list register"}
set a get request to get a user detail based on id => /user[id value]
e.g => output => json => {result: "list detail for id"}, {result: [], msg: "detail of id"}
*/
// .use(), .get(), .post()
// .put(), .patch(), .delete(), .set(), .get()
//app.use('/',(request,response)=>{
    // response.send("hello express");
    //response.json({
       // result:"hello express",
       // msg:"success",
        //meta:null
   // })
//})

module.exports = app;