import { Response, Request } from "express";
import { userRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { FindOperator, ObjectId } from "typeorm";

type jwtPayload = {
    id:ObjectId
}

export class UserController {
    async create(req:Request, res:Response){
        const {name, email, password} = req.body;

        const existenEmail = await userRepository.findOneBy({email: email})

        if(existenEmail){
            return res.status(404).json({ msg: `Email ${email} já está cadastrado!` })
        }

        const passwordHash = bcrypt.hashSync(password, 12);

        const newUser = userRepository.create({
            name,
            email,
            password:passwordHash
        })

        await userRepository.save(newUser);

        const { password: _, ...user } = newUser

        return res.status(201).json(user)
    };

    async login(req:Request, res:Response){
        const {email, password} = req.body;

        const user = await userRepository.findOneBy({email});

        if(!user){
            return res.status(400).json({msg: `Email ou senha invalidos!`})
        }

        const verifyPassword = bcrypt.compareSync(password, user.password);

        if(!verifyPassword){
            return res.status(400).json({msg: `Email ou senha invalidos!`})
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_PASS ?? '', 
            {expiresIn: '8h'}
        )

        const {password: _ , ...userLogin} = user

        return res.json({
            user: userLogin,
            token: token
        })
        
    }

    async getProfile(req:Request, res:Response){
        try {

            const { authorization } = req.headers
            const user = await userRepository.find();

            if (!authorization) {
                return res.status(401).json({msg: 'Não autorizado!'})
            }
    
            const token = authorization.split(' ')[1];
    
            const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as jwtPayload
    
    
            if(!id){
                return res.status(401).json({msg: 'Não autorizado'})
            }

            const usersWithoutPassword = user.map((user) => {
                const {password, ...userWithoutPassword} = user;
                return userWithoutPassword;
            })

            return res.json(usersWithoutPassword);
            
        } catch (error) {
            return res.status(500).json({msg: 'Internal Server Error'})
        }
       
    }

}