export const loginAction = ({ user, token }) => ({
    type: "LOGIN",
    user,
    token,
});

export const logoutAction = () => ({
    type: "LOGOUT",
});

export const updateRankAction = (rank) => ({
    type: "UPDATE_RANK",
    rank,
});
