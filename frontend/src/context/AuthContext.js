"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Criação do contexto de autenticação para compartilhar informações de autenticação entre componentes
const AuthContext = createContext();

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação para gerenciar o estado de autenticação e fornecer métodos de login/logout
export const AuthProvider = ({ children }) => {
    // Estado para armazenar o token de autenticação
    const [token, setToken] = useState(null);
    // Hook para acessar o roteador do Next.js para redirecionar o usuário
    const router = useRouter();

    // Efeito para verificar se há um token armazenado localmente ao montar o componente
    useEffect(() => {
        // Verifica se há um token armazenado localmente
        const storedToken = localStorage.getItem('token');
        // Se houver um token armazenado, atualiza o estado de token
        // Caso contrário, redireciona o usuário para a página de login
        if (storedToken) {
            setToken(storedToken);
        } else {
            router.push('/login');
        }
    }, []);

    // Função para realizar o login, atualizando o estado de token e armazenando o token localmente
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    // Função para realizar o logout, limpando o estado de token e removendo o token armazenado localmente
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        // Redireciona o usuário para a página de login após o logout
        router.push('/login');
    };

    // Retorna o provedor de contexto de autenticação, fornecendo o estado de token e as funções de login/logout
    return (
        <AuthContext.Provider value={{ token, setToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
