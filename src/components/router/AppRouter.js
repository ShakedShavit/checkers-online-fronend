import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import GameContextProvider from '../../context/gameContext';
import LoginContextProvider from '../../context/loginContext';
import MatchPage from '../game/MatchPage';
import HomePage from '../home/HomePage';
import LoginPage from '../login/LoginPage';
import PageNotFound from '../not-found/PageNotFound';
import LoginRoute from './LoginRoute';
import MatchRoute from './MatchRoute';
import UserRoute from './UserRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/home" />
                    </Route>
                    <Route path="/home" component={HomePage} />
                    <LoginRoute path="/login" component={LoginPage} />
                    <GameContextProvider>
                        <MatchRoute path="/match" component={MatchPage} />
                    </GameContextProvider>
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </LoginContextProvider>
        </BrowserRouter>
    )
};

// <UserRoute path="/lobby" component={GameLobby} />

export default AppRouter;