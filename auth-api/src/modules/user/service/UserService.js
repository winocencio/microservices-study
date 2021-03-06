import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repository/UserRepository.js";
import UserException from "../exception/UserException.js";
import * as secrets from "../../../config/constants/secrets.js";
import * as httpStatus from "../../../config/constants/httpStatus.js";

class UserService {

    async findByEmail(req){
        try{
            const { email } = req.params;
            const { authUser } = req;
            this.validateRequestData(email);
            let user = await UserRepository.findByEmail(email);

            this.validateUserNotFound(user);
            this.validateAuthenticatedUser(user,authUser)
            return {
                status: httpStatus.SUCCESS,
                user: {
                    id : user.id,
                    name : user.name,
                    email: user.email
                }
            }

        }catch (error){
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            }
        }

    }

    validateRequestData(email){
        if(!email){
            throw new UserException(httpStatus.BAD_REQUEST,"User email was not informed");

        }
    }

    validateUserNotFound(user){
        if(!user){
            throw new UserException(httpStatus.BAD_REQUEST,"user was not found");
        }
    }

    validateUserNotFoundWithoutAccess(user){
        if(!user){
            throw new UserException(httpStatus.UNAUTHORIZED,"Email and password doesn't match.");
        }
    }

    async getAccessToken(req){

        try{

            const {email,password} = req.body;
            this.validateAcessTokenData(email,password);

            let user = await UserRepository.findByEmail(email);

            this.validateUserNotFoundWithoutAccess(user);
            await this.validatePassword(password,user.password);

            const authUser = { id: user.id,name: user.name , email: user.email};
            const accesToken = jwt.sign({authUser}, secrets.API_SECRET,{expiresIn: "1d"});

            return {
                status: httpStatus.SUCCESS,
                accesToken,
            }

        }catch (error){
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            }
        }
    }

    validateAcessTokenData(email,password){
        if(!email || !password){
            throw new UserException(httpStatus.UNAUTHORIZED,"Email and password must be informed");
        }
    }

    async validatePassword(password,hashPassword){
        if(!await bcrypt.compare(password,hashPassword)){
            throw new UserException(httpStatus.UNAUTHORIZED,"Email and password doesn't match.");
        }
    }

    validateAuthenticatedUser(user,authUser){
        if(!authUser || user.id !== authUser.id){
            throw new UserException(httpStatus.UNAUTHORIZED,"You can't see this user data.");
        }
    }


}


export default new UserService();