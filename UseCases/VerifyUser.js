import {User_DB} from '../models/User.js';
import { VERIFY_BY } from '../utils/types.js';
import { ReadData } from './DB_Handler.js';


/**
 * 
 * @param {1} user from request
 * @param {2} verifyby option to check DB for
 * @returns either undefined/null or a user object or throws an error
 */
export async function DB_verifyUser(user,verifyby){
   
    let existingUser;
    const DB = await ReadData();
    try{
        switch (verifyby) {
            case VERIFY_BY.EMAIL:
                existingUser = DB.find(curr_user=> curr_user.email === user.email);
                break;
            
                case VERIFY_BY.ID:
                    existingUser = DB.find(curr_user=>curr_user.id === user.id);
                    break;
            
            default:
                throw new Error("Verification option is not valid");   
        }

        return existingUser;
        

        
    }catch(err){
        existingUser = null;
        throw new Error(err.message);
    }
 
}