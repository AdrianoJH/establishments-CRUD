"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdDeleteForever, MdEdit } from "react-icons/md";
import Image from 'next/image'
import { deleteEstablishment, fetchEstablishments } from '@/services/api';
import styles from "./page.module.css";
import ModalDel from '@/components/modalDel/modalDel';

export default function Home() {
  const [establishments, setEstablishments] = useState([]); // Estado para armazenar os estabelecimentos
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Estado para controlar a exibição do modal de exclusão
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(null); // Estado para armazenar o ID do estabelecimento selecionado
  const router = useRouter(); // Hook para navegação do Next.js

  const fetchEstablishmentsData = async () => { // Função para buscar os estabelecimentos na API
    try {
      const data = await fetchEstablishments(); // Chamada à função da API para buscar os estabelecimentos
      setEstablishments(data); // Atualização do estado com os estabelecimentos retornados
      localStorage.setItem('establishments', JSON.stringify(data)); // Armazenamento dos estabelecimentos no localStorage
    } catch (error) {
      console.error('Failed to fetch establishments:', error.message); // Tratamento de erro em caso de falha na busca dos estabelecimentos
    }
  };

  useEffect(() => { // Efeito para buscar os estabelecimentos ao carregar a página
    const storedEstablishments = localStorage.getItem('establishments'); // Busca dos estabelecimentos armazenados no localStorage
    if (storedEstablishments) {
      setEstablishments(JSON.parse(storedEstablishments)); // Atualização do estado com os estabelecimentos armazenados
    } else {
      fetchEstablishmentsData(); // Chamada à função para buscar os estabelecimentos na API caso não haja no localStorage
    }
  }, []); // Dependência vazia para garantir que o efeito seja executado apenas uma vez ao montar o componente

  const handleDeleteEstablishment = async (id) => { // Função para lidar com a exclusão de um estabelecimento
    try {
      await deleteEstablishment(id); // Chamada à função da API para excluir o estabelecimento
      const updatedEstablishments = establishments.filter(establishment => establishment.id !== id); // Filtragem dos estabelecimentos para remover o excluído
      setEstablishments(updatedEstablishments); // Atualização do estado com os estabelecimentos atualizados
      localStorage.setItem('establishments', JSON.stringify(updatedEstablishments)); // Atualização do localStorage com os estabelecimentos atualizados
    } catch (error) {
      console.error('Erro ao excluir o estabelecimento:', error); // Tratamento de erro em caso de falha na exclusão do estabelecimento
    }
  };

  const handleEditEstablishment = (id) => { // Função para lidar com a edição de um estabelecimento
    router.push(`/editEstablishments/${id}`); // Navegação para a página de edição do estabelecimento com o ID correspondente
  };

  const handleOpenDeleteModal = (id) => { // Função para lidar com a abertura do modal de exclusão
    setShowDeleteModal(true); // Ativação do modal de exclusão
    setSelectedEstablishmentId(id); // Definição do ID do estabelecimento selecionado
  };

  return (
    <div className={styles.establishmentContainer}>
      <h1 className={styles.titleAuth}>Estabelecimentos</h1>
      <ul className={styles.boxList} >
        {establishments.map((establishment) => ( // Mapeamento dos estabelecimentos para renderização na lista
          <li className={styles.itemList} key={establishment.id}> {/* Item da lista */}
            <span className={styles.boxImg}><Image src={establishment.image} width={70} height={70} alt={establishment.name} className={styles.imgList} /></span>
            <hr className={styles.divider} />
            <span className={styles.boxText}>
              <p className={styles.textList}>{establishment.name}</p>
              <p className={styles.textList}>{establishment.phone}</p>
            </span>
            <span className={styles.contentBtn}> {/* Botões de ação */}
              <MdDeleteForever className={styles.svgDel} onClick={() => handleOpenDeleteModal(establishment.id)} />
              <MdEdit className={styles.svgEdit} onClick={() => handleEditEstablishment(establishment.id)} />
            </span>
          </li>
        ))}
      </ul>
      {showDeleteModal && (
        <ModalDel
          showDeleteButton={true} //Propriedade para exibir o botão de exclusão 
          onDelete={() => { //Função para exclusão do estabelecimento
            handleDeleteEstablishment(selectedEstablishmentId); // Chamada à função para excluir o estabelecimento
            setShowDeleteModal(false); // Desativação do modal de exclusão
          }}
          setShowModal={setShowDeleteModal} //Função para definir o estado de exibição do modal 
        />
      )}
    </div>
  );
}
