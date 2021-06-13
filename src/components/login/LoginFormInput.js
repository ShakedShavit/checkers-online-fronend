import React from 'react';
import errIcon from '../../images/err-icon.png';

const LoginFormInput = (props) => {
    const inputOnBlur = () => {
        props.setIsInputFirstChange(false);
    }

    return (
        <>
            <label>{props.name}:</label>
            {
                !!props.inputRef ?
                <input defaultValue="Abcdef1" ref={props.inputRef} type={props.inputType} name={props.name} onChange={props.onChangeFunc} onBlur={inputOnBlur}></input> :
                <input defaultValue="a" type={props.inputType} name={props.name} onChange={props.onChangeFunc} onBlur={inputOnBlur}></input>
            }
            {
                props.inputErrMsg !== '' &&
                <div className="login-input__err-msg">
                    <img src={errIcon} alt="input-error-icon"></img>
                    <span>{props.inputErrMsg}</span>
                </div>
                
            }
        </>
    )
};

export default LoginFormInput;