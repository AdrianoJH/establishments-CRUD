"use client";
import Header from "@/components/header";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";
import styles from '@/app/page.module.css';
import { useEffect, useState } from "react";
import { metadata } from "./metadata";
import Image from "next/image";

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false); // Definindo o estado 'isMobile' para verificar se a tela é de um dispositivo móvel

  useEffect(() => { // Utilizando o hook useEffect para lidar com efeitos colaterais
    function handleResize() { // Função para lidar com a mudança de tamanho da tela
      setIsMobile(window.innerWidth <= 768); // Atualizando o estado 'isMobile' baseado no tamanho da tela
    }

    handleResize(); // Chamando a função para definir o estado 'isMobile' inicialmente

    window.addEventListener('resize', handleResize); // Adicionando um ouvinte de evento para a mudança de tamanho da tela
    return () => window.removeEventListener('resize', handleResize); // Removendo o ouvinte de evento quando o componente é desmontado
  }, []); // A lista de dependências está vazia para que o efeito seja executado apenas uma vez, após a montagem do componente

  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href={metadata.icons.icon} type="image/x-icon" />
        <title>{metadata.title}</title>
      </head>
      <body suppressHydrationWarning={true}> 
        <AuthProvider>
          <header>
            <Header />
          </header>
          {isMobile && ( // Renderizando um bloco específico se a tela for um dispositivo móvel
            <div className={styles.boxLogo}>
              <Image src="images/logo.svg" width={40} height={40} alt='Logo' className={styles.logoMobile} unoptimized />
              <h1 className={styles.title}>Estabelecimentos CRUD</h1>
            </div>
          )}
          {!isMobile && ( // Renderizando um bloco específico se a tela não for um dispositivo móvel
            <>
            </>
          )}
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
