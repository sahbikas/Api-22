
const validatedRequest = (Schema) =>{
   return (req, res, next) => {
   try{
      //console.log("inside validated request");
      let data = req.body;
       Schema.parse(data);
       next()
   }catch(exception){
      console.log(exception);
      next(exception)
   }
   
   }

}

module.exports = validatedRequest