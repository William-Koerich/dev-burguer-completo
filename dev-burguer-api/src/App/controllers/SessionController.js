
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import authConfig from './../../config/auth.js';
class SessionController{
    async store (request, response) {
        const schema = Yup.object ({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

       const isValid = await schema.isValid(request.body, { 
        abortEarly: false, 
        strict: true
    });
        const emailOrPasswordIncorrect = () =>{

           return response
        .status(400)
        .json ({ error: 'EMAIL OR PASSWORD INCORRECT'});
        };
        
       if (!isValid) {

        return emailOrPasswordIncorrect();
        
        
       }
         const { email, password } = request.body;

       const userExists = await User.findOne({
        where: {
            email,
        },


    })
    if (!userExists) {
         return emailOrPasswordIncorrect();
    }
      const ispasswordCorrect = await bcrypt.compare(
        password, 
        userExists.password_hash,
      );

      if (!ispasswordCorrect) {
        return emailOrPasswordIncorrect();
      }

      const token = jwt.sign(
        { 
          id: userExists.id, 
          admin: userExists.admin, 
          name: userExists.name,
         }, 
         authConfig.secret, 
        { expiresIn: authConfig.expiresIn }); //gerenateToken();

        return response.status(200).json({
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            admin: userExists.admin,    
            token,
          });
    }
};

export default new SessionController();