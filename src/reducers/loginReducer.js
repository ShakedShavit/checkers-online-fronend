export const initialUserDataState = {
    user: null,
    token: ''
};

const loginReducer = (userData, action) => {
    switch (action.type) {
        case "LOGIN":
            console.log(action.user);
            return { user: action.user, token: action.token };
        case "LOGOUT":
            return { user: null, token: '' };
        case "UPDATE_RANK": {
            return { user: { ...userData.user, rank: action.rank }, token: userData.token }
        }
        default:
            return { ...userData };
    }
}

export default loginReducer;