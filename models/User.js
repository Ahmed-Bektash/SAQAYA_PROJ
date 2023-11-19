import bcrypt from 'bcrypt';
import crypto from "crypto"

export class User{
    constructor(firstName, lastName,email,consent) {
        const salt = email +"450d0b0db2bcf4adde5032eca1a7c416e560cf44";
        this.id = crypto.createHash('sha1').update(salt).digest().toString('base64');
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.consent = consent;
        this.token = "";
        //password
      }
}
export const User_DB = [];
