import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { loginUserInDB, signupUserInDB } from '../../server/db/user';
import Form from '../main/Form';
import Loader from './Loader';
import LoginFormInput from './LoginFormInput';
import { saveUserOnCookie } from '../../cookies/userDataCookies';
import { LoginContext } from '../../context/loginContext';
import { loginAction } from '../../actions/loginActions';

const LoginForm = (props) => {
    const { dispatchUserData } = useContext(LoginContext);

    const [usernameErrMsg, setUsernameErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    const [passwordRepeatErrMsg, setPasswordRepeatErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUsernameInputFirstChange, setIsUsernameInputFirstChange] = useState(true);
    const [isPasswordInputFirstChange, setIsPasswordInputFirstChange] = useState(true);
    const [isRepeatedPasswordInputFirstChange, setIsRepeatedPasswordInputFirstChange] = useState(true);

    const passwordInputEl = useRef(null);

    const history = useHistory();

    const usernameInputOnChange = (e) => {
        props.setFormErrMsg('');
        if (isUsernameInputFirstChange) return;
        getIsUsernameInputValid(e.target.value.trim());
    }
    const getIsUsernameInputValid = (inputValue) => {
        if (inputValue === '') return setUsernameErrMsg('username cannot be empty');
        if (!(/.*[a-zA-Z].*/.test(inputValue))) return setUsernameErrMsg('username must contain at least one letter');
        if (inputValue.includes(' ')) return setUsernameErrMsg('username cannot contain spaces');
        
        setUsernameErrMsg('');
        return true;
    }

    const passwordInputOnChange = () => {
        props.setFormErrMsg('');
        if (isPasswordInputFirstChange) return;
        getIsPasswordInputValid();
    }
    const getIsPasswordInputValid = () => {
        const password = passwordInputEl.current.value;

        if (password === '') return setPasswordErrMsg('password cannot be empty');
        if (password.includes(' ')) return setPasswordErrMsg('password cannot contain spaces');
        if (!(/.*[a-zA-Z].*/.test(password))) return setPasswordErrMsg('password must contain at least one letter');
        if (password.length < 6) return setPasswordErrMsg('password cannot be shorter than 6 characters');
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(password)) return setPasswordErrMsg('password must contain at least one number and one capital letter');

        setPasswordErrMsg('');
        return true;
    }

    const repeatPasswordInputOnChange = (e) => {
        props.setFormErrMsg('');
        if (isRepeatedPasswordInputFirstChange) return;
        getIsRepeatedPasswordInputValid(e.target.value);
    }
    const getIsRepeatedPasswordInputValid = (inputValue) => {
        const password = passwordInputEl.current.value;
        if (inputValue !== password) return setPasswordRepeatErrMsg('passwords do not match');

        setPasswordRepeatErrMsg('');
        return true;
    }


    const checkInputsOnSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return props.setFormErrMsg(`${props.isSignupForm ? 'Signup' : 'Login'} still processing`);
    
        props.setFormErrMsg('');
    
        const username = e.target[0].value.trim();
        const password = e.target[1].value;
        
        const isUsernameValid = getIsUsernameInputValid(username);
        const isPasswordValid = getIsPasswordInputValid(password);
        const isRepeatedPasswordValid = props.isSignupForm ? getIsRepeatedPasswordInputValid(e.target[2].value) : true;
        if (!isUsernameValid || !isPasswordValid || !isRepeatedPasswordValid) return props.setFormErrMsg('Check inputs errors');

        setIsLoading(true);

        loginOrSignupInDB(username, password);
    }

    const loginOrSignupInDB = (username, password) => {
        if (props.isSignupForm) {
            signupUserInDB(username, password)
            .then((res) => {
                loginInSite(res);
            })
            .catch((err) => {
                console.log(err);
                props.setFormErrMsg(err.message);
                setIsLoading(false);
            });
        } else {
            loginUserInDB(username, password)
            .then((res) => {
                loginInSite(res);
            })
            .catch((err) => {
                console.log(err);
                props.setFormErrMsg(err.message);
                setIsLoading(false);
            });
        }
    }

    const loginInSite = (res) => {
        console.log(res)
        setIsLoading(false);
        dispatchUserData(loginAction({ user: res.user, token: res.token }));
        saveUserOnCookie(res);
        history.push('/home');
    }

    return (
        <Form
            className={'login-form'}
            formErrMsg={props.formErrMsg}
            submitButtonText={props.isSignupForm ? 'Signup': 'Login'}
            isSubmitButtonEnabled={(!isUsernameInputFirstChange && !isPasswordInputFirstChange &&
                (!props.isSignupForm || !isRepeatedPasswordInputFirstChange)) &&
                (!usernameErrMsg && !passwordErrMsg &&
                (!props.isSignupForm || !passwordRepeatErrMsg))}
            onSubmitFunc={checkInputsOnSubmit}
        >
            <LoginFormInput
                name={'username'}
                inputType={'text'}
                onChangeFunc={usernameInputOnChange}
                setIsInputFirstChange={setIsUsernameInputFirstChange}
                inputErrMsg={usernameErrMsg}
             />

            <LoginFormInput
                inputRef={passwordInputEl}
                name={'password'}
                inputType={'password'}
                onChangeFunc={passwordInputOnChange}
                setIsInputFirstChange={setIsPasswordInputFirstChange}
                inputErrMsg={passwordErrMsg}
             />

            {
                props.isSignupForm &&
                <LoginFormInput
                    name={'repeat-password'}
                    inputType={'password'}
                    onChangeFunc={repeatPasswordInputOnChange}
                    setIsInputFirstChange={setIsRepeatedPasswordInputFirstChange}
                    inputErrMsg={passwordRepeatErrMsg}
                />
            }

            { isLoading && <Loader /> }
        </Form>
    )
};

export default LoginForm;