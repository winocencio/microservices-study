import UserService from "../service/UserService.js";

class UserController {

    async getAccessToken(req,res){
        let accesToken = await UserService.getAccessToken(req);
        return res.status(accesToken.status).json(accesToken);
    }

    async findByEmail(req,res){
        let user = await UserService.findByEmail(req);
        return res.status(user.status).json(user);
    }
}

export default new UserController();