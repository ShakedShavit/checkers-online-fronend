import React, { useEffect, useState } from 'react';
import { loginUserInDB } from '../../server/db/user';
import Loader from './Loader';
import LoginAndSignupForm from './LoginAndSignupForm';

const LoginForm = () => {
    const [loginErrMsg, setLoginErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    let isComponentMounted = true;
    useEffect(() => {
        return () => { isComponentMounted = false; }
    }, []);

    const checkOtherInputs = () => {
        return true;
    }

    const loginOnSubmit = (username, password) => {
        setLoginErrMsg('');
        setIsLoading(true);

        loginUserInDB(username, password)
        .then((res) => {
            console.log(res)
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoginErrMsg(err.message);
            setIsLoading(false);
        });
    }

    return (
        <LoginAndSignupForm submitButtonText="Login" submitForm={loginOnSubmit} checkOtherInputs={checkOtherInputs}>
            { loginErrMsg !== '' && <span>{loginErrMsg}</span> }
            { isLoading && <Loader /> }
        </LoginAndSignupForm>
    );

    // const [loginErrMsg, setLoginErrMsg] = useState('');
    // const [usernameErrMsg, setUsernameErrMsg] = useState('');
    // const [passwordErrMsg, setPasswordErrMsg] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // let isUsernameValid = false, isPasswordValid = false;

    // let isComponentMounted = true;
    // useEffect(() => {
    //     return () => { isComponentMounted = false; }
    // }, []);

    // const [loginErrMsg, setLoginErrMsg] = useState('');
    // const [usernameErrMsg, setUsernameErrMsg] = useState('');
    // const [passwordErrMsg, setPasswordErrMsg] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    // let isUsernameValid = false, isPasswordValid = false;

    // let isComponentMounted = true;
    // useEffect(() => {
    //     return () => { isComponentMounted = false; }
    // }, []);

    // const usernameInputOnBlur = (e, inputValue) => {
    //     isUsernameValid = false;

    //     const username = e ? e.target.value.trim() : inputValue;
    //     if (username === '') return setUsernameErrMsg('username cannot be empty');
    //     if (!(/.*[a-zA-Z].*/.test(username))) return setUsernameErrMsg('username must contain at least one letter');
    //     if (username.includes(' ')) return setUsernameErrMsg('username cannot contain spaces');

    //     isUsernameValid = true;
    //     setUsernameErrMsg('');
    // }

    // const passwordInputOnBlur = (e, inputValue) => {
    //     isPasswordValid = false;

    //     const password = e ? e.target.value.trim() : inputValue;
    //     if (password === '') return setPasswordErrMsg('password cannot be empty');
    //     if (password.includes(' ')) return setPasswordErrMsg('password cannot contain spaces');
    //     if (!(/.*[a-zA-Z].*/.test(password))) return setPasswordErrMsg('password must contain at least one letter');
    //     if (password.length < 6) return setPasswordErrMsg('password cannot be shorter than 6 characters');
    //     if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/).test(password)) return setPasswordErrMsg('password must contain at least one number and one capital letter');

    //     isPasswordValid = true;
    //     setPasswordErrMsg('');
    // }

    // const loginOnSubmit = (e) => {
    //     e.preventDefault();

    //     setLoginErrMsg('');

    //     const username = e.target[0].value.trim();
    //     usernameInputOnBlur(null, username);

    //     const password = e.target[1].value;
    //     passwordInputOnBlur(null, password);

    //     if (!isUsernameValid || !isPasswordValid) return;

    //     setIsLoading(true);

    //     loginUserInDB()
    //     .then((res) => {
    //         console.log(res)
    //         setIsLoading(false);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         setLoginErrMsg(err.message);
    //         setIsLoading(false);
    //     });
    // }

    // return (
    //     <>
    //         <Form submitButtonText="Login" onSubmitFunc={loginOnSubmit}>
    //             <label>user name:</label>
    //             <input type="text" name="username" className={usernameErrMsg !== '' && 'input-invalid'} onBlur={usernameInputOnBlur}></input>
    //             { usernameErrMsg !== '' && <span>{usernameErrMsg}</span> }

    //             <label>password:</label>
    //             <input type="password" name="password" className={passwordErrMsg !== '' && 'input-invalid'} onBlur={passwordInputOnBlur}></input>
    //             { passwordErrMsg !== '' && <span>{passwordErrMsg}</span> }

    //             { loginErrMsg !== '' && <span>{loginErrMsg}</span> }

    //             { isLoading && <Loader /> }
    //         </Form>

    //         <NavLink to="/home" className="home-link">Home</NavLink>
    //     </>
    // );

    // return (
    //     <>
    //         <form onSubmit={loginOnSubmit}>
    //             <label>user name:</label>
    //             <input type="text" name="username" className={usernameErrMsg !== '' && 'input-invalid'} onBlur={usernameInputOnBlur}></input>
    //             { usernameErrMsg !== '' && <span>{usernameErrMsg}</span> }

    //             <label>password:</label>
    //             <input type="password" name="password" className={passwordErrMsg !== '' && 'input-invalid'} onBlur={passwordInputOnBlur}></input>
    //             { passwordErrMsg !== '' && <span>{passwordErrMsg}</span> }

    //             <button type="submit">Login</button>
    //             { loginErrMsg !== '' && <span>{loginErrMsg}</span> }

    //             { isLoading && <Loader /> }
    //         </form>

    //         <NavLink to="/home" className="home-link">Home</NavLink>
    //     </>
    // )
};

export default LoginForm;