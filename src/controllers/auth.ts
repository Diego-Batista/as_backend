import { RequestHandler } from "express";
import { z } from "zod";
import * as auht from "../services/auth";

export const login: RequestHandler = (req, res) => {
    const loginSchema = z.object({
        password: z.string()
    });

    const body = loginSchema.safeParse(req.body);

    if(!body.success) return res.json({ error: 'Dados invàlidos' })

    // Validar senha e gerar o token
    if(!auht.validatePassword(body.data.password)) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    return res.json({
        token: auht.createToken()
    });

} 

export const validate: RequestHandler =(req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(403).json({ error: 'Acesso negado' })
    }

    const token = req.headers.authorization.split(' ')[1];
    if(!auht.validateToken(token)){
        return res.status(403).json({ error: 'Acesso negado' })
    }

    
    next()
}