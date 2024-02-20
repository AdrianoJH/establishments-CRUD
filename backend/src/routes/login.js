import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config(); 

const prisma = new PrismaClient(); // Inicializando o cliente Prisma para interagir com o banco de dados
const router = express.Router(); // Inicializando um roteador Express

const secretKey = process.env.JWT_SECRET; // Obtendo a chave secreta para assinar tokens JWT do ambiente

router.post('/', async (req, res) => { // Definindo uma rota POST para autenticação de usuários
    const { email, password } = req.body; // Extraindo o email e a senha do corpo da requisição
    const user = await prisma.user.findUnique({ where: { email } }); // Buscando o usuário no banco de dados pelo email fornecido

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' }); // Verificando se o usuário existe. Se não, retorna um erro 404

    const validPassword = await bcrypt.compare(password, user.password); // Verificando se a senha fornecida corresponde à senha do usuário
    if (!validPassword) return res.status(401).json({ message: 'Senha incorreta' }); // Se a senha estiver incorreta, retorna um erro 401

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '8760000h' }); // Gerando um token JWT válido para o usuário autenticado
    res.json({ token }); // Retornando o token JWT para o cliente
});

export default router; 
