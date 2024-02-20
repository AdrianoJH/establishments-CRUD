"use client";
import Link from 'next/link';
import styles from '@/app/page.module.css';
import { logoutUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function Menu({ toggleMenu }) { // Define o componente Menu, que recebe a função toggleMenu como propriedade
    const { token, setToken } = useAuth(); // Obtém o token de autenticação e a função setToken do contexto de autenticação

    const handleLogout = async () => { // Define a função handleLogout para lidar com o logout do usuário
        try {
            await logoutUser(); // Chama a função de logout do usuário da API
            localStorage.removeItem('token'); // Remove o token do armazenamento local
            setToken(null); // Define o token como nulo no contexto de autenticação
            window.location.href = '/login'; // Redireciona o usuário para a página de login após o logout
        } catch (error) { // Trata qualquer erro que possa ocorrer durante o logout
            console.error('Erro ao fazer logout:', error.message);
        }
    };

    return (
        <nav className={styles.nav}>
            {token && <ul className={styles.navbar}> {/* Renderiza o menu se o token de autenticação existir */}
                <li onClick={() => toggleMenu()} className={styles.navItem}><Link href="/" className={styles.navLink}>Home</Link></li>
                <li onClick={() => toggleMenu()} className={styles.navItem}><Link href="/registerEstablishments" className={styles.navLink}>Adicionar</Link></li>
                <li onClick={() => toggleMenu()} className={styles.navItem}><Link href="/notifications" className={styles.navLink}>Notificações</Link></li>
                <li onClick={() => toggleMenu()} className={styles.navItem}><Link href="#" className={styles.navLink} onClick={handleLogout}>Sair</Link></li>
            </ul>}
        </nav>
    );
};

