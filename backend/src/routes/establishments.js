import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient(); // Inicializando o cliente Prisma para interagir com o banco de dados
const router = express.Router(); // Criando um novo roteador Express para lidar com as rotas relacionadas aos estabelecimentos

const storage = multer.diskStorage({ // Configurando o armazenamento de arquivos enviados via upload
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Definindo o diretório de destino para os arquivos enviados
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Definindo o nome do arquivo a ser salvo
  }
});
const upload = multer({ storage: storage }); // Configurando o middleware Multer para lidar com upload de arquivos

router.get('/', async (req, res) => { // Definindo a rota para obter todos os estabelecimentos
  const establishments = await prisma.establishment.findMany(); // Buscando todos os estabelecimentos do banco de dados

  const establishmentsWithPublicImagePath = establishments.map(establishment => ({ // Mapeando os estabelecimentos para adicionar o caminho público das imagens
    ...establishment,
    image: `${req.protocol}://${req.get('host')}/files/${path.basename(establishment.image)}`
  }));

  res.json(establishmentsWithPublicImagePath); // Enviando a lista de estabelecimentos com os caminhos públicos das imagens
});

router.post('/', upload.single('image'), async (req, res) => { // Definindo a rota para cadastrar um novo estabelecimento
  try {
    const { name, phone } = req.body; // Obtendo os dados do corpo da requisição
    const imagePath = req.file.path; // Obtendo o caminho da imagem enviada
    const establishment = await prisma.establishment.create({ // Criando um novo estabelecimento no banco de dados
      data: {
        image: imagePath,
        name,
        phone,
      },
    });
    res.json(establishment); // Enviando o estabelecimento criado como resposta
  } catch (error) {
    console.error('Erro ao cadastrar estabelecimento:', error); // Lidando com erros durante o cadastro do estabelecimento
    res.status(500).json({ message: 'Erro ao cadastrar estabelecimento', error: error.message }); // Enviando uma resposta de erro
  }
});

router.put('/:id', upload.single('image'), async (req, res) => { // Definindo a rota para atualizar um estabelecimento existente
  const { id } = req.params; // Obtendo o ID do estabelecimento a ser atualizado
  const { name, phone } = req.body; // Obtendo os novos dados do estabelecimento
  let updatedEstablishmentData = { name, phone };

  if (req.file) { // Verificando se uma nova imagem foi enviada
    updatedEstablishmentData.image = req.file.path; // Atualizando o caminho da imagem
  }

  const updatedEstablishment = await prisma.establishment.update({ // Atualizando os dados do estabelecimento no banco de dados
    where: { id: parseInt(id) },
    data: updatedEstablishmentData
  });
  res.json(updatedEstablishment); // Enviando o estabelecimento atualizado como resposta
});

router.delete('/:id', async (req, res) => { // Definindo a rota para excluir um estabelecimento
  const { id } = req.params; // Obtendo o ID do estabelecimento a ser excluído
  try {
    await prisma.establishment.delete({ // Excluindo o estabelecimento do banco de dados
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Estabelecimento excluído com sucesso' }); // Enviando uma mensagem de sucesso
  } catch (error) {
    console.error('Erro ao excluir Estabelecimento:', error); // Lidando com erros durante a exclusão do estabelecimento
    res.status(500).json({ message: 'Erro ao excluir Estabelecimento', error: error.message }); // Enviando uma resposta de erro
  }
});

export default router; 
