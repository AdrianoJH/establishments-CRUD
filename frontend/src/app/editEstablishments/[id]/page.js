"use client";
import { useRef, useState, useEffect } from 'react';
import { MdFileUpload } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { updateEstablishment, fetchEstablishments, setAuthToken } from '@/services/api';
import styles from "@/app/page.module.css";

export default function EditEstablishment({ params }) { // Componente de edição de estabelecimento, recebendo parâmetros
    const fileInputRef = useRef(null); // Referência para o input de arquivo
    const [selectedFile, setSelectedFile] = useState(null); // Estado para armazenar o arquivo selecionado
    const [formData, setFormData] = useState({ // Estado para armazenar dados do formulário
        name: '',
        phone: '',
    });
    const [establishments, setEstablishments] = useState([]); // Estado para armazenar lista de estabelecimentos
    const router = useRouter(); // Instância do useRouter para manipulação de rotas
    const { id } = params; // Extração do id dos parâmetros

    useEffect(() => {
        // Função assíncrona para buscar os detalhes do estabelecimento com o id fornecido
        const fetchData = async () => {
            try {
                // Chamada para buscar os detalhes do estabelecimento
                const establishmentData = await fetchEstablishments(id);
                // Verificação dos dados do estabelecimento
                if (establishmentData && establishmentData.length > 0) {
                    // Encontrando o estabelecimento com o id correspondente
                    const establishmentToUpdate = establishmentData.find(est => est.id === parseInt(id));
                    // Se o estabelecimento for encontrado
                    if (establishmentToUpdate) {
                        // Extração dos dados do estabelecimento
                        const { name, phone, image } = establishmentToUpdate;
                        // Atualização do estado formData com os dados do estabelecimento
                        setFormData({
                            name: name || '',
                            phone: phone || '',
                        });
                        // Definindo o arquivo selecionado, se houver uma imagem
                        setSelectedFile(image ? { name: image.split('/').pop() } : null);
                    } else {
                        // Se o estabelecimento não for encontrado, exibir mensagem de erro
                        console.error(`Estabelecimento com id ${id} não encontrado.`);
                    }
                }
            } catch (error) {
                // Tratamento de erro ao buscar os detalhes do estabelecimento
                console.error('Erro ao buscar os detalhes do estabelecimento:', error);
            }
        };

        // Obtendo estabelecimentos armazenados localmente
        const storedEstablishments = localStorage.getItem('establishments');
        if (storedEstablishments) {
            // Atualizando o estado de estabelecimentos com os dados armazenados
            setEstablishments(JSON.parse(storedEstablishments));
        }

        // Se houver um id, chamar a função fetchData
        if (id) {
            fetchData();
        }
    }, [id]);

    // Efeito para configurar o token de autenticação
    useEffect(() => {
        // Verificação do token de autenticação
        const token = localStorage.getItem('token');
        if (token) {
            // Se o token existir, configurar o token de autenticação
            setAuthToken(token);
        } else {
            // Se não houver token, redirecionar para a página de login
            router.push('/login');
        }
    }, []);

    // Função para lidar com o clique no botão de arquivo
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    // Função para lidar com a mudança de arquivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Se houver um arquivo selecionado, atualizá-lo no estado
            setSelectedFile(file);
        }
    };

    // Função para lidar com o clique no rótulo de arquivo
    const handleLabelClick = (e) => {
        e.preventDefault();
        handleFileButtonClick();
    };

    // Função para lidar com a submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Criar uma cópia dos dados do estabelecimento atualizados
            const updatedEstablishmentData = { ...formData };
            if (selectedFile) {
                // Se houver um arquivo selecionado, adicioná-lo aos dados do estabelecimento
                updatedEstablishmentData.image = selectedFile;
            }
            // Atualizar os detalhes do estabelecimento
            await updateEstablishment(id, updatedEstablishmentData);

            // Buscar os estabelecimentos atualizados
            const updatedEstablishments = await fetchEstablishments();

            // Atualizar o estado de estabelecimentos com os estabelecimentos atualizados
            setEstablishments(updatedEstablishments);
            // Atualizar estabelecimentos armazenados localmente
            localStorage.setItem('establishments', JSON.stringify(updatedEstablishments));

            // Redirecionar para a página inicial
            router.push('/');
        } catch (error) {
            // Tratamento de erro ao editar o estabelecimento
            console.error('Erro ao editar o estabelecimento:', error);
        }
    };

    // Função para lidar com a mudança de entrada de texto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Atualizar o estado do formulário com o valor do campo alterado
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className={styles.authContainer}>
            <h2 className={styles.titleAuth}>Editar Estabelecimento</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='Nome'
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder='Telefone'
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="fileImg" onClick={handleLabelClick}>
                        {selectedFile ? (
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
                    />
                </div>
                <button className={styles.actionBtn} type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
}