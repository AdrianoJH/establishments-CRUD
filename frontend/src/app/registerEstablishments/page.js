"use client";
import { useEffect, useRef, useState } from 'react';
import { MdFileUpload } from "react-icons/md";
import { createEstablishment, fetchEstablishments, setAuthToken } from '@/services/api';
import styles from "@/app/page.module.css";

export default function RegisterEstablishments() {
    const fileInputRef = useRef(null); // Referência para o input de arquivo
    const [selectedFile, setSelectedFile] = useState(null); // Estado para armazenar o arquivo selecionado
    const [name, setName] = useState(''); // Estado para armazenar o nome do estabelecimento
    const [phone, setPhone] = useState(''); // Estado para armazenar o telefone do estabelecimento
    const [error, setError] = useState(''); // Estado para armazenar mensagens de erro
    const [establishments, setEstablishments] = useState([]); // Estado para armazenar a lista de estabelecimentos

    const handleFileButtonClick = () => { // Função para lidar com o clique no botão de arquivo
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => { // Função para lidar com a alteração do arquivo selecionado
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleLabelClick = (e) => { // Função para lidar com o clique no label
        e.preventDefault();
        handleFileButtonClick();
    };

    const handleSubmit = async (e) => { // Função para lidar com o envio do formulário
        e.preventDefault();

        try {
            const formData = new FormData(); // Criando um novo objeto FormData para enviar os dados
            formData.append('name', name); // Adicionando o nome ao formulário
            formData.append('phone', phone); // Adicionando o telefone ao formulário
            formData.append('image', selectedFile); // Adicionando a imagem ao formulário

            const response = await createEstablishment(formData); // Enviando os dados do formulário para a API criar um novo estabelecimento
            console.log("Estabelecimento adicionado com sucesso!", response); // Registrando sucesso no console
            setName(''); // Resetando o nome do estabelecimento
            setPhone(''); // Resetando o telefone do estabelecimento
            setSelectedFile(null); // Resetando o arquivo selecionado

            const updatedEstablishments = await fetchEstablishments(); // Atualizando a lista de estabelecimentos

            setEstablishments(updatedEstablishments); // Definindo a nova lista de estabelecimentos
            localStorage.setItem('establishments', JSON.stringify(updatedEstablishments)); // Salvando a lista de estabelecimentos atualizada no armazenamento local
        } catch (error) {
            setError('Erro ao adicionar Estabelecimento'); // Lidando com erros durante a adição de um estabelecimento
        }
    };

    useEffect(() => { // Efeito para verificar se há um token de autenticação no armazenamento local
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token); // Configurando o token de autenticação para as requisições
        } else {
            router.push('/login'); // Redirecionando para a página de login se não houver token de autenticação
        }
    }, []);

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.titleAuth}>Adicionar Estabelecimento</h2>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='Nome'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='Telefone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="fileImg" onClick={handleLabelClick}>
                        {selectedFile ? ( // Verifica se há um arquivo selecionado
                            <>
                                {selectedFile.name}
                            </>
                        ) : (
                            <>
                                Selecione uma imagem
                                <MdFileUpload className={styles.svg} />
                            </>
                        )}
                    </label>
                    <input
                        type='file'
                        id='fileImg'
                        accept='image/*'
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        required
                    />
                </div>
                <button className={styles.actionBtn} type="submit">Adicionar</button>
            </form>
        </div>
    );
};
