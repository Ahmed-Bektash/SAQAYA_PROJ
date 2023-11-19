import { VERIFY_BY } from "../utils/types.js";
import jsonwebtoken from "jsonwebtoken";
import { DB_verifyUser } from "./VerifyUser.js";


export async function Authenticate(req,res,next){
    let token
// auth header looks like: Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]; //we want the token

      // Verify token
      // console.log("about to verify")
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await DB_verifyUser(decoded,VERIFY_BY.ID); 
      // console.log(req.user)
      if(!req.user){
        throw new Error("user not in database");
      }

      next();
    } catch (error) {
      console.log(error.message)
      res.status(401);
      const response = {
        success: false,
        message: "You are not authenticated",
        error: error.message,
        };
      res.json(response); 
    }
  }
  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') &&
    !token) {
    res.status(401);
    const response = {
        success: false,
        message: "You are not authenticated",
        error: "There is no token in the header",
        };
    res.json(response); 
  }
    
}
