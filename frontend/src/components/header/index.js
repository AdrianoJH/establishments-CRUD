"use client";
import { useEffect, useState } from 'react';
import styles from '@/app/page.module.css';
import Logo from "./logo";
import Menu from "./menu";
import { FaBars, FaXmark } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const [isMenuVisible, setIsMenuVisible] = useState(false); // Define um estado para controlar a visibilidade do menu
    const [isMobile, setIsMobile] = useState(false); // Define um estado para controlar se o dispositivo é móvel
    const { token, setToken } = useAuth(); // Obtém o token de autenticação e a função para defini-lo do contexto de autenticação

    useEffect(() => { // Define um efeito para atualizar o estado "isMobile" quando o tamanho da janela é alterado
        function handleResize() {
            setIsMobile(window.innerWidth <= 768); // Define "isMobile" como verdadeiro se a largura da janela for menor ou igual a 768 pixels
        }

        handleResize(); // Chama a função handleResize para definir o estado inicial

        window.addEventListener('resize', handleResize); // Adiciona um ouvinte de evento para detectar alterações no tamanho da janela
        return () => window.removeEventListener('resize', handleResize); // Remove o ouvinte de evento quando o componente é desmontado
    }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez, após a montagem inicial do componente

    const toggleMenu = () => { // Define uma função para alternar a visibilidade do menu
        setIsMenuVisible(!isMenuVisible); // Inverte o estado de "isMenuVisible"
    }

    return (
        <> {/* Renderiza condicionalmente com base no token de autenticação e na visibilidade do menu */}
            {token && // Renderiza o botão do menu móvel apenas se houver um token de autenticação
                <div className={styles.boxBtnMenuMobile}>
                    <button className={styles.btnMenuMobile} onClick={toggleMenu}>{isMenuVisible ? <FaXmark className={styles.iconClose} /> : <FaBars className={styles.iconOpen} />}</button>
                </div>
            }
            {isMobile && isMenuVisible && ( // Renderiza o cabeçalho móvel apenas se o dispositivo for móvel e o menu estiver visível
                <div className={styles.headerMobile}>
                    <Logo />
                    <Menu toggleMenu={toggleMenu} />
                </div>
            )}
            {!isMobile && ( // Renderiza o cabeçalho padrão apenas se o dispositivo não for móvel
                <div className={styles.header}>
                    <div className={styles.contentLogo}>
                        <Logo />
                        <h1 className={styles.title}>Estabelecimentos CRUD</h1>
                    </div>
                    <Menu toggleMenu={toggleMenu} />
                </div>
            )}
        </>
    );
};
