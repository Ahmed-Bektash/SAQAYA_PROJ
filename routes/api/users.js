import { Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import {Authenticate} from '../../UseCases/Auth.js';
import { DB_verifyUser } from '../../UseCases/VerifyUser.js';
import {User_DB, User} from '../../models/User.js';
import { VERIFY_BY } from '../../utils/types.js';
import { WriteData } from '../../UseCases/DB_Handler.js';

const users = Router();

//@route    POST api/users
//@desc     Create a user
//@access   public
users.post('/',async(req,res)=>{
    
    //check first that they don't exist
    try {
        const user_to_verify= {
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            consent: req.body.marketingConsent
          };
            
        const existingUser =  await DB_verifyUser(user_to_verify,VERIFY_BY.EMAIL);
        if(existingUser)
        {
          throw new Error("user already exists!");
        }
        
        let userInfo= new User(user_to_verify.firstName,user_to_verify.lastName,user_to_verify.email,user_to_verify.consent);
        
        const response = {
          id:userInfo.id,
          accesstoken:generateToken(userInfo.id),
        }
        const user_to_save = {
          id:userInfo.id,
          firstName:userInfo.firstName,
          lastName:userInfo.lastName,
          email:userInfo.email,
          marketingConsent: userInfo.consent.toString(),
          accesstoken:response.accesstoken,
        }
        await WriteData(user_to_save);
        // console.log(user_to_save);
        res.status(201).json(response);
        console.log("successfully added a user",req.body.firstName)
        
            
    } catch (error) {
        const response = {
          success: false,
          message: "User registration failed",
          error: error.message,
        }
        console.log(response)
        res.status(400).json(response);
    }

}); 

 
//@route    GET api/users/:id
//@desc     return a user
//@access   private
   users.get('/:id',Authenticate,async(req,res)=>{
      const response = {
          id: req.params.id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          marketingConsent: req.user.marketingConsent,
        }
        if(req.user.marketingConsent === "true")
        {
          response.email = req.user.email;
        }
        
      res.status(201).json(response);
   }); 


   //Generating a token:
  const generateToken = (id) =>{
    const token = jsonwebtoken.sign({id},process.env.JWT_SECRET,{
      expiresIn:'1h',
    });
    return token;
  }
export default users;