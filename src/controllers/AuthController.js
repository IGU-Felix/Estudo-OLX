import bcrypt from 'bcrypt'
import { createUser, findStateByName, findUserByEmail, updateToken, findUserByTokenWithRelations } from '../models/User.js'
import jwt from 'jsonwebtoken';

export const signup = async (req,res) => {
    try {
        const data = req.body
        const user = await findUserByEmail(data.email)
        if (user) {
            res.status(500).json({
                error: 'Email already exists!'
            })
            return
        }

        const passwordHash = await bcrypt.hash(data.password, 10)
        const payload = (Date.now() + Math.random()).toString()
        const token = await bcrypt.hash(payload, 10)

        const stateId = await findStateByName(data.state)

        await createUser({
            name:data.name,
            email:data.email,
            passwordHash,
            token,
        }, stateId.id)

        res.status(201).json({token})

    } catch (error) {
        res.status(500).json({error: 'Failed to create user', message: error.message })
    }
}

export const signinv2 = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (!user) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const match = await bcrypt.compare(data.password, user.passwordHash)
        if (!match) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, 'password', { expiresIn: '1h' });

        await updateToken(user.id, token);
        res.status(200).json({ userId: user.id, token });

    } catch (error) {
        res.status(500).json({ error: "Failed to log in", message: error.message });
    }
};

export const signin = async (req,res) => {
    try {
        const data = req.body

        //Verificar se o email existe
        const user = await findUserByEmail(data.email)
        if (!user) {
            res.status(500).json({ error: "Email or password invalid!"})
            return
        } 

        //Verificar se a senha está correta
        const match = await bcrypt.compare(data.password, user.passwordHash)
        if (!match) {
            res.status(500).json({ error: "Email or password invalid!"})
            return
        }

        //Gerar um novo token
        const payload = (Date.now() + Math.random()).toString()
        const token = await bcrypt.hash(payload, 10)
        await updateToken(user.id, token)

        //Retornar o status
        res.status(200).json({userId: user.id, token})

    } catch (error) {
        res.status(500).json({error:"Failed to log in", message:error.message})
    }
}

export const info = async (req,res) => {
    try {
        let token = req.body.token
        const user = await findUserByTokenWithRelations(token)

    } catch (error) {
        res.status(500).json({error: "Failed to get info of the user", message:error.message})
    }
}