"use client";
import styles from '@/app/page.module.css';
import { MdCancel, MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

//Recebe as propriedades showDeleteButton, onDelete e setShowModal como argumentos
export default function ModalDel({ showDeleteButton, onDelete, setShowModal }) {
    const confirmDelete = () => {
        onDelete(); // Executa a função onDelete para excluir o item
        setShowModal(false); // Fecha o modal após a exclusão
    };

    const cancelDelete = () => {
        setShowModal(false); // Fecha o modal sem excluir o item
    };
    return (
        <div className={styles.modalContainer}>
            <div className={styles.modalContent}>
                <MdClose className={styles.svgClose} onClick={cancelDelete} />
                <div className={styles.boxMsgModal}>
                    <span className={styles.textMsg}>Tem Certeza que deseja excluir esse item?</span>
                    <span className={styles.textMsg}>Essa ação será irreversível.</span>
                </div>
                <div className={styles.boxBtnModal}>
                    {showDeleteButton && (  //Renderiza o botão de exclusão somente se showDeleteButton for true 
                        <button className={styles.btnConfirm} onClick={confirmDelete}>
                            <FaCheck className={styles.svgBtnConfirm} />
                            Confirmar
                        </button >
                    )}
                    <button className={styles.btnCancel} onClick={cancelDelete}>
                        <MdCancel className={styles.svgCancel} />
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
