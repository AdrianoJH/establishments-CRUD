import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient(); // Inicializando o cliente Prisma para acessar o banco de dados
const router = express.Router(); // Inicializando um novo roteador Express

router.post('/', async (req, res) => { // Rota para lidar com requisições POST na raiz do caminho definido para este roteador
    const { email, password } = req.body; // Obtendo os campos 'email' e 'password' do corpo da requisição

    const existingUser = await prisma.user.findUnique({ where: { email } }); // Verificando se já existe um usuário com o email fornecido
    if (existingUser) { // Se o usuário já existir, retornar uma resposta de erro
        return res.status(400).json({ message: 'Usuário já registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Fazendo hash da senha fornecida

    const newUser = await prisma.user.create({ // Criando um novo usuário no banco de dados
        data: { email, password: hashedPassword } // Passando o email e a senha hasheada como dados para criação do usuário
    });

    res.json({ message: 'Usuário registrado com sucesso', user: newUser }); // Retornando uma resposta de sucesso com o novo usuário criado
});

export default router; 
