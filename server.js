import express, { json } from 'express';
import dotenv from 'dotenv'

dotenv.config();
import { ErrorResponse, ErrorTypes } from './utils/utils.js';
//requiring the routes: it's kept in a separate folder to be clean.
import users from './routes/api/users.js';

//initialize the app
const app = express();

//body parser middleware
app.use(json()); 
  

//middleware for all apis to make sure all routes with this url will go to a routing handler.
app.use('/api/users',users);

//set up ports and server init
const port = process.env.PORT || 5000;

const server = app.listen(port, async()=>{
    console.log(`server started on port ${port}`); 
    //configure DB connections here
    // await ConnectDBs();
}); 

process.on("unhandledRejection",(error)=>{ //this also takes a promise with the error 
    console.log("There is an error",error);
    server.close(()=>process.exit(1)); //1 means error 
  });

app.all('*',(req,res,next)=>{
    const path = req.url
    const method= req.method
    next(new ErrorResponse(`page not found on url ${path} for ${method}`,ErrorTypes.RESOURCE_NOT_FOUND))
    res.end();
  })

