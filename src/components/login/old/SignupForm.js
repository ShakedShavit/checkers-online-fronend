import React, { useState } from 'react';
import { signupUserInDB } from '../../server/db/user';
import Loader from './Loader';
import LoginAndSignupForm from './LoginAndSignupForm';

const SignupForm = () => {
    const [repeatPasswordErrMsg, serRepeatPasswordErrMsg] = useState('');
    const [signupErrMsg, setSignupErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let isRepeatPasswordValid = false;

    const repeatPasswordInputOnBlur = (password, repeatPassword) => {
        isRepeatPasswordValid = false;

        if (repeatPassword !== password) return serRepeatPasswordErrMsg('passwords do not match');

        isRepeatPasswordValid = true;
        serRepeatPasswordErrMsg('');
    }

    const checkOtherInputs = (e) => {

        getPasswordsAndCallOnBlur(e);
        return isRepeatPasswordValid;
    }

    const getPasswordsAndCallOnBlur = (e) => {
        let repeatPasswordValue, passwordValue;
        if (e.target.value != null) {
            repeatPasswordValue = e.target.value;
            passwordValue = e.target.parentNode.querySelector('input[name="password"]').value;
        } else {
            repeatPasswordValue = e.target.querySelector('input[name="repeat-password"]').value;
            passwordValue = e.target.querySelector('input[name="password"]').value;
        }
        repeatPasswordInputOnBlur(passwordValue, repeatPasswordValue)
    }

    const signupOnSubmit = (username, password) => {
        setSignupErrMsg('');
        setIsLoading(true);

        signupUserInDB(username, password)
        .then((res) => {
            console.log(res)
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setSignupErrMsg(err.message);
            setIsLoading(false);
        });
    }

    return (
        <LoginAndSignupForm submitButtonText="Signup" onSubmit={signupOnSubmit} checkOtherInputs={checkOtherInputs}>
            <label>repeat password:</label>
            <input type="password" name="repeat-password" onBlur={getPasswordsAndCallOnBlur}></input>
            { repeatPasswordErrMsg !== '' && <span>{repeatPasswordErrMsg}</span> }

            { signupErrMsg !== '' && <span>{signupErrMsg}</span> }

            { isLoading && <Loader /> }
        </LoginAndSignupForm>
    )
};

export default SignupForm;