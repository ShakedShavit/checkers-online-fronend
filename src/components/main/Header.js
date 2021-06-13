import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { logoutAction } from '../../actions/loginActions';
import { LoginContext } from '../../context/loginContext';
import { deleteUserFromCookie } from '../../cookies/userDataCookies';
import Modal from './Modal';
import socket from '../../server/socketio';
import RankCircle from '../main/RankCircle';

const Header = () => {
    const { userDataState, dispatchUserData } = useContext(LoginContext);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [areButtonHidden, setAreButtonHidden] = useState(false);
    const [logoutModalMainText, setLogoutModalMainText] = useState('Are you sure you want to logout?');

    const openLogoutModalOnClick = () => {
        setIsLogoutModalOpen(true);
    }

    const logout = () => {
        socket.emit('logout'); // Removes the player from lobby
        dispatchUserData(logoutAction());
        deleteUserFromCookie();

        setAreButtonHidden(true);
        setLogoutModalMainText('Goodbye. See you soon!');

        setTimeout(() => {
            setIsLogoutModalOpen(false);
        }, 1800);
    }

    return (
        <div className="header-container">
            {
                !!userDataState.user ?
                <div className="user-info">
                    <span>{userDataState.user.username}</span>
                    <RankCircle rank={userDataState.user.rank} />
                    <button className="logout-button" onClick={openLogoutModalOnClick}>Logout</button>
                </div> :
                <NavLink to="/login" className="login-nav-link">Login</NavLink>
            }
            
            {
                isLogoutModalOpen &&
                <Modal
                    setIsModalOpen={setIsLogoutModalOpen}
                    mainText={logoutModalMainText}
                    confirmFunc={logout}
                    areButtonHidden={areButtonHidden}
                >
                </Modal>
            }
        </div>
    )
};

export default Header;