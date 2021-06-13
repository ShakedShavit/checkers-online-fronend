import React, { useRef, useState } from 'react';
import Form from '../main/Form';

const LoginAndSignupForm = (props) => {
    // const [formErrMsg, setFormErrMsg] = useState('');
    const [usernameErrMsg, setUsernameErrMsg] = useState('');
    const [passwordErrMsg, setPasswordErrMsg] = useState('');
    // const [passwordRepeatErrMsg, setPasswordRepeatErrMsg] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    let isUsernameValid = false, isPasswordValid = false;

    const usernameInputOnBlur = (e, inputValue) => {
        isUsernameValid = false;

        const username = e ? e.target.value.trim() : inputValue;
        if (username === '') return setUsernameErrMsg('username cannot be empty');
        if (!(/.*[a-zA-Z].*/.test(username))) return setUsernameErrMsg('username must contain at least one letter');
        if (username.includes(' ')) return setUsernameErrMsg('username cannot contain spaces');

        isUsernameValid = true;
        setUsernameErrMsg('');
    }

    const passwordInputOnBlur = (e, inputValue) => {
        isPasswordValid = false;

        const password = e ? e.target.value : inputValue;
        if (password === '') return setPasswordErrMsg('password cannot be empty');
        if (password.includes(' ')) return setPasswordErrMsg('password cannot contain spaces');
        if (!(/.*[a-zA-Z].*/.test(password))) return setPasswordErrMsg('password must contain at least one letter');
        if (password.length < 6) return setPasswordErrMsg('password cannot be shorter than 6 characters');
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(password)) return setPasswordErrMsg('password must contain at least one number and one capital letter');

        isPasswordValid = true;
        setPasswordErrMsg('');
    }

    const checkInputsOnSubmit = (e) => {
        e.preventDefault();
    
        // setFormErrMsg('');
    
        const username = e.target[0].value.trim();
        usernameInputOnBlur(null, username);
    
        const password = e.target[1].value;
        passwordInputOnBlur(null, password);

        const areOtherInputsValid = props.checkOtherInputs(e);
    
        if (!isUsernameValid || !isPasswordValid || !areOtherInputsValid) return;
    
        // setIsLoading(true);

        props.submitForm(username, password);
    
        // loginUserInDB()
        // .then((res) => {
        //     console.log(res)
        //     setIsLoading(false);
        // })
        // .catch((err) => {
        //     console.log(err);
        //     setLoginErrMsg(err.message);
        //     setIsLoading(false);
        // });
    }

    return (
        <Form submitButtonText={props.submitButtonText} onSubmitFunc={checkInputsOnSubmit}>
            <label>user name:</label>
            <input type="text" name="username" onBlur={usernameInputOnBlur}></input>
            { usernameErrMsg !== '' && <span>{usernameErrMsg}</span> }

            <label>password:</label>
            <input type="password" name="password" onBlur={passwordInputOnBlur}></input>
            { passwordErrMsg !== '' && <span>{passwordErrMsg}</span> }

            {props.children}
        </Form>
    )
};

export default LoginAndSignupForm;