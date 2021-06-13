import errIcon from '../../images/err-icon.png';

const Form = (props) => {
    return (
        <form className={props.className} onSubmit={props.onSubmitFunc}>
            {props.children}
            <button type="submit" disabled={!props.isSubmitButtonEnabled}>{props.submitButtonText}</button>
            {
                props.formErrMsg !== '' && 
                <div className="login-input__err-msg">
                    <img src={errIcon} alt="input-error-icon"></img>
                    <span>{props.formErrMsg}</span>
                </div>
            }
        </form>
    )
};

export default Form;