import express from 'express'; 
import routes from './routes/index.js';
import cors from 'cors'; 
import path from 'path'; 

const app = express(); 
const PORT = process.env.PORT || 3000;

const publicImagesPath = path.join(process.cwd(), 'public', 'images'); // Definindo o caminho absoluto para a pasta de imagens públicas

app.use(express.json()); 

app.use(cors()); 

app.use('/files', express.static(publicImagesPath)); // Configurando o Express para servir arquivos estáticos na rota '/files' a partir do diretório de imagens públicas

app.use('/api', routes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});
