import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
}); // Criando uma instância do axios com a URL base definida para as requisições

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}; // Função para definir o token de autenticação nas requisições ou removê-lo se não estiver presente

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        alert("Cadastro efetuado com sucesso!", response.data); 
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}; // Função para registrar um usuário na API

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/login', userData);
        const { token } = response.data;
        setAuthToken(token); // Definindo o token de autenticação após o login
        alert("Login efetuado com sucesso!", response.data); 
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}; // Função para realizar o login na API

export const logoutUser = async () => {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao fazer logout: ' + error.message);
    }
}; // Função para fazer logout na API

export async function fetchEstablishments() {
    try {
        const response = await api.get('/establishments');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch establishments: ' + error.message);
    }
} // Função para buscar estabelecimentos na API

export async function createEstablishment(formData) {
    try {
        const response = await api.post('/establishments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        alert("Estabelecimento adicionado com sucesso!", response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
} // Função para criar um estabelecimento na API

export async function updateEstablishment(id, establishmentData) {
    try {
        const formData = new FormData();
        Object.keys(establishmentData).forEach(key => {
            if (key === 'image') {
                formData.append(key, establishmentData[key]);
            } else {
                formData.append(key, establishmentData[key]);
            }
        });
        const response = await api.put(`/establishments/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert("Estabelecimento atualizado com sucesso!", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update establishment: ' + error.message);
    }
} // Função para atualizar um estabelecimento na API

export async function deleteEstablishment(id) {
    try {
        const response = await api.delete(`/establishments/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete establishment: ' + error.message);
    }
} // Função para deletar um estabelecimento na API

export async function getMessages() {
    try {
        const response = await api.get('/messages?_expand=user');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch messages with users: ' + error.message);
    }
} // Função para buscar mensagens na API, incluindo detalhes do usuário que as enviou

export default api;
