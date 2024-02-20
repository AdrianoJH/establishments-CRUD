"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import Link from 'next/link';
import { loginUser } from '@/services/api';
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import styles from '@/app/page.module.css';

export default function Login() {
    const [email, setEmail] = useState(''); // Definindo estado para o email do usuário
    const [password, setPassword] = useState(''); // Definindo estado para a senha do usuário
    const [error, setError] = useState(''); // Definindo estado para possíveis erros de autenticação
    const [showPassword, setShowPassword] = useState(false); // Definindo estado para mostrar ou ocultar a senha
    const { login } = useAuth(); // Obtendo a função de login do contexto de autenticação

    const router = useRouter(); // Inicializando o hook useRouter para navegação entre páginas

    const handleLogin = async (e) => { // Função para lidar com a submissão do formulário de login
        e.preventDefault(); // Prevenindo o comportamento padrão de envio do formulário

        try {
            const response = await loginUser({ email, password }); // Tentando realizar o login com o email e senha fornecidos

            if (response) { // Se a resposta for válida
                login(response.token); // Chamando a função de login com o token retornado pela API
                router.push('/'); // Redirecionando o usuário para a página inicial
            }
        } catch (error) { // Lidando com erros de autenticação
            setError('Usuário ou senha incorretos'); // Definindo a mensagem de erro
        }
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.titleAuth}>Login</h1>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.inputContainer}>
                    <MdEmail className={styles.svg} />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <FaLock className={styles.svg} />
                    <input
                        className={styles.input}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Senha'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {showPassword ? ( // Exibindo ícone de olho aberto ou fechado para mostrar ou ocultar a senha
                        <FaEyeSlash onClick={() => setShowPassword(false)} className={styles.eye} />
                    ) : (
                        <FaEye onClick={() => setShowPassword(true)} className={styles.eye} />
                    )}
                </div>
                <div className={styles.linkContainer}>
                    <p className={styles.txtCadastrar}>
                        Ainda não possui conta?
                    </p>
                    <Link href="/register" className={styles.linkCadastrar}>
                        Cadastre-se
                    </Link>
                </div>
                <button className={styles.actionBtn} type="submit">Login</button>
            </form>
        </div>
    );
}