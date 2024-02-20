import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Inicializando o cliente Prisma para interagir com o banco de dados
const router = express.Router(); // Inicializando um roteador do Express

router.get('/', async (req, res) => {
    // Rota para lidar com requisições GET na raiz do caminho definido para este roteador
    const messages = await prisma.message.findMany({ // Buscando todas as mensagens no banco de dados
        include: {
            user: true, // Incluindo informações do usuário associado a cada mensagem
        },
    });
    res.json(messages); // Enviando as mensagens como resposta da requisição
});

router.post('/', async (req, res) => {
    // Rota para lidar com requisições POST na raiz do caminho definido para este roteador
    const { content } = req.body; // Obtendo o conteúdo da mensagem do corpo da requisição
    const userId = req.userId; // Obtendo o ID do usuário do token

    try {
        const message = await prisma.message.create({
            // Criando uma nova mensagem no banco de dados
            data: {
                content, // Conteúdo da mensagem
                user: { connect: { id: userId } }, // Conectando a mensagem ao usuário pelo ID
            },
        });
        res.json(message); // Enviando a mensagem criada como resposta da requisição
    } catch (error) {
        console.error(error); // Registrando qualquer erro ocorrido durante o processo
        res.status(500).json({ message: 'Erro ao criar a mensagem' }); // Enviando uma resposta de erro com status 500
    }
});

export default router; 