import React, { useState, useEffect } from 'react';
import styles from './AdminRedes.module.css';

const AdminRedes = () => {
    const [links, setLinks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEdit, setCurrentEdit] = useState({ id: '', link: '', value: '' });
    const [newValue, setNewValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/links/get`);
                if (!response.ok) {
                    throw new Error('Error al obtener los enlaces');
                }
                const data = await response.json();
                setLinks(data);
            } catch (err) {
                setError('Hubo un error al cargar las redes.');
            }
        };

        fetchLinks();
    }, []);

    const openModal = (id, link, value) => {
        setCurrentEdit({ id, link, value });
        setNewValue(value);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentEdit({ id: '', link: '', value: '' });
        setNewValue('');
    };

    const confirmEdit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/links/update/${currentEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: newValue }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el enlace');
            }

            setLinks((prevLinks) =>
                prevLinks.map((link) =>
                    link._id === currentEdit.id ? { ...link, value: newValue } : link
                )
            );

            closeModal();
        } catch (err) {
            setError('Hubo un error al actualizar el enlace.');
        }
    };

    return (
        <div className={styles.adminRedesContainer}>
            <h1>ACTUALIZAR CONTACTOS</h1>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={styles.linksList}>
                {links.map((link) => (
                    <div key={link._id} className={styles.linkItem}>
                        <p>
                            <strong>
                                {link.link === 'main' && 'Cuenta Principal:'}
                                {link.link === 'backup' && 'Cuenta de Respaldo:'}
                                {link.link === 'number' && 'Número:'}
                            </strong>{' '}
                            {link.value}
                        </p>
                        <button onClick={() => openModal(link._id, link.link, link.value)} className={styles.editButton}>
                            Editar
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Editar {currentEdit.link === 'main' ? 'Cuenta Principal' : currentEdit.link === 'backup' ? 'Cuenta de Respaldo' : 'Número'}</h2>
                        <input
                            type="text"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className={styles.inputField}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={closeModal} className={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button onClick={confirmEdit} className={styles.confirmButton}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRedes;
