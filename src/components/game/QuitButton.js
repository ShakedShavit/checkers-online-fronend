import React, { useState } from 'react';
import Modal from '../main/Modal';

const QuitButton = (props) => {
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

    let mainQuitModalText = 'Are you sure you want to quit?';
    if (props.hasGameStarted) mainQuitModalText += ' Quitting now will affect your rank!';

    const openQuitModalOnClick = () => {
        setIsQuitModalOpen(true);
    }

    return (
        <>
            <button onClick={openQuitModalOnClick}>{props.hasGameStarted ? 'Concede' : 'Quit'}</button>
            {
                isQuitModalOpen &&
                <Modal
                    setIsModalOpen={setIsQuitModalOpen}
                    mainText={mainQuitModalText}
                    confirmFunc={props.quitFunc}
                    confirmText="Quit"
                    closeModalText='Stay'
                    switchButtonsDesign={true}
                >
                </Modal>
            }
        </>
    )
};

export default QuitButton;