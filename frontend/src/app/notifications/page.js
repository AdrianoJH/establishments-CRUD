"use client";
import { useState, useEffect } from 'react';
import { getMessages, setAuthToken } from '@/services/api';
import styles from "../page.module.css";

export default function Notification() {
    const [messages, setMessages] = useState([]); // Declarando estado para armazenar as mensagens

    useEffect(() => { // Efeito que é executado quando o componente é montado
        fetchMessages(); // Chamando a função para buscar as mensagens
    }, []);

    const fetchMessages = async () => { // Função assíncrona para buscar as mensagens
        try {
            const messagesData = await getMessages(); // Chamando a função para obter as mensagens
            setMessages(messagesData); // Atualizando o estado com as mensagens obtidas
        } catch (error) { // Capturando erros, caso ocorram
            console.error('Error fetching messages:', error); // Exibindo mensagem de erro no console
        }
    };

    useEffect(() => { // Efeito que é executado quando o componente é montado
        const token = localStorage.getItem('token'); // Obtendo o token de autenticação armazenado no localStorage
        if (token) { // Verificando se o token existe
            setAuthToken(token); // Definindo o token de autenticação nas requisições da API
        } else { // Caso o token não exista
            router.push('/login'); // Redirecionando para a página de login
        }
    }, []);

    return (
        <div className={styles.establishmentContainer}>
            <h1 className={styles.titleAuth}>Notificações</h1>
            <ul className={styles.boxList}>
                {messages.map((message, index) => ( // Mapeando as mensagens para renderização na lista
                    <li className={styles.itemListMessage} key={index}>
                        <span className={styles.textList}>{message.user.email}</span>
                        <span className={styles.boxMessage}>
                            <p className={styles.message}>{message.content}</p>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}