import React from 'react';

const Modal = (props) => {
    const closeModalButton = (e) => {
        closeModal(e);
    }
    const modalClicked = (e) => {
        e.stopPropagation();
    }
    const closeModal = (e) => {
        if (e != undefined) e.preventDefault();
        if (typeof(props.closeModalFunc) === 'function') {
            props.closeModalFunc();
        }
        props.setIsModalOpen(false)
    }

    let confirmButtonClassList = 'modal-button';
    let closeButtonClassList = 'modal-button';
    if (!!props.switchButtonsDesign) {
        confirmButtonClassList += ' grey-button';
        closeButtonClassList += ' green-button';
    } else {
        confirmButtonClassList += ' green-button';
        closeButtonClassList += ' grey-button';
    }
    
    return (
        <div className="modal-container" onClick={closeModal}>
            <div className="checkout-modal modal" onClick={modalClicked}>
                <button className="close-modal" onClick={closeModalButton}>x</button>
                <span className="modal-text">{props.mainText}</span>
                {
                    !props.areButtonHidden &&
                    <div className="checkout-modal-buttons modal-buttons">
                        <span className={confirmButtonClassList} onClick={props.confirmFunc}>{props.confirmText || 'Yes'}</span>
                        <span className={closeButtonClassList} onClick={closeModal}>{props.closeModalText || 'No'}</span>
                    </div>
                }
            </div>
        </div>
    )
};

export default Modal;