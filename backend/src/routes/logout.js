import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    // Limpando o cookie chamado 'token'
    res.clearCookie('token');
    // Respondendo com um objeto JSON contendo uma mensagem de logout bem-sucedido
    res.json({ message: 'Logout bem-sucedido' });
});

export default router;
