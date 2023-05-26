export const BASE_URL = "http://localhost:8080/api/"


export default {
    LOGIN: (username, password) => {
        return BASE_URL + `user/login?username=${username}&password=${password}`;
    },
    GET_BY_EMAIL: (email) => {
        return BASE_URL + `user/email/${email}`;
    },
    GET_CURRENT_USER: BASE_URL + `user/current-user`,
    GET_USER_SCORES_BY_USER_ID: (userId) => {
        return BASE_URL + `userscore/user/${userId}`;
    },
    CREATE_ROOM: BASE_URL + `room`,
    CREATE_GAME: BASE_URL + `game`,
    CREATE_USER_SCORE: BASE_URL + `userscore`,
}
