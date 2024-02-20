import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import establishmentsRouter from './establishments.js';
import messagesRouter from './messages.js';
import registerRouter from './register.js';
import loginRouter from './login.js';
import logoutRouter from './logout.js';

dotenv.config(); 

const router = express.Router(); // Cria um novo roteador do Express
const secretKey = process.env.JWT_SECRET; // Obtém a chave secreta para assinar tokens JWT do arquivo .env

// Middleware para verificar se o token de autenticação é válido
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    // Se o token não estiver presente, retorna um erro de não autorizado
    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    // Verifica se o token é válido
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Falha na autenticação do token' });
        }
        req.userId = decoded.id; // Adiciona o ID do usuário decodificado ao objeto de requisição
        next(); // Chama a próxima função middleware na cadeia
    });
};

// Rotas para registro, login e logout
router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/logout', logoutRouter);

// Middleware para verificar o token em rotas subsequentes
router.use(verifyToken);

// Rotas para manipulação de estabelecimentos e mensagens
router.use('/establishments', establishmentsRouter);
router.use('/messages', messagesRouter);

export default router;
