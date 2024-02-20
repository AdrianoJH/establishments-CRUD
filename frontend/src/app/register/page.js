"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/services/api';
import { FaArrowLeftLong } from "react-icons/fa6";
import styles from '@/app/page.module.css';

export default function Register() {
    // Definindo os estados para armazenar o email, senha, confirmação de senha, mensagem de erro e estado de registro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [registered, setRegistered] = useState(false);

    // Utilizando o hook useRouter para obter o objeto de roteamento do Next.js
    const router = useRouter();

    // Função assíncrona para lidar com o registro de usuário
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevenindo o comportamento padrão do formulário

        // Verificando se a senha e a confirmação de senha correspondem
        if (password !== confirmPassword) {
            setError('As senhas não correspondem');
            return;
        }

        try {
            // Criando um objeto com os dados do usuário
            const userData = { email, password };
            // Chamando a função registerUser da API para registrar o usuário
            const response = await registerUser(userData);

            console.log('Usuário registrado com sucesso:', response);
            // Definindo o estado de registro como true após o registro bem-sucedido
            setRegistered(true);
        } catch (error) {
            // Capturando e tratando erros ao tentar registrar o usuário
            setError('Erro ao registrar usuário: ' + error.message);
        }
    };

    // Redirecionando para a página de login se o usuário estiver registrado com sucesso
    if (registered) {
        return router.push('/login');;
    }

    return (
        <div className={styles.authContainer}>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <h1 className={styles.titleAuth}>Criar Conta</h1>
            <form className={styles.form} onSubmit={handleRegister}>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type='text'
                        placeholder='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type='password'
                        placeholder='Senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type='password'
                        placeholder='Confirme a Senha'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                </div>
                <Link className={styles.actionLink} href="/login"><FaArrowLeftLong className={styles.svg} />Voltar</Link>
                <button className={styles.actionBtnRegister} type="submit">Register</button>
            </form>
        </div>
    );
}
