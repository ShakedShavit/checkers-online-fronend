import Axios from 'axios';

const url = 'http://localhost:5000';
// const url = 'http://host.docker.internal:5000';

export const loginUserInDB = async (username, password) => {
    try {
        const res = await Axios.post(url + '/login', {
            username,
            password
        });

        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 400)
            throw new Error(err.response.data);
        throw new Error(err.message);
    }
};

export const signupUserInDB = async (username, password) => {
    try {
        const res = await Axios.post(url + '/signup', {
            username,
            password
        });

        return { user: res.data.user, token: res.data.token };
    } catch (err) {
        if (err.response.status === 422)
            throw new Error(err.response.data);
        throw new Error('Unable to signup. Please try again');
    }
};