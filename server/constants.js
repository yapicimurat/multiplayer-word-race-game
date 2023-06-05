export const GAME_MODE = {
    CLASSIC: 1,
    LANGUAGE: 2
}

export const PORT = 3000;

export const EMIT_EVENTS = {
    CLIENT_ROOM_INFORMATIONS: "CLIENT_ROOM_INFORMATIONS",
    CREATE_NICKNAME: "CREATE_NICKNAME",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    SPECIAL_ROOM_INFORMATION: "SPECIAL_ROOM_INFORMATION",
    CLIENT_GAME_INFORMATIONS: "CLIENT_GAME_INFORMATIONS",
    CLIENT_COMPLETE_WORD: "CLIENT_COMPLETE_WORD",
    CLIENT_END_GAME: "CLIENT_END_GAME",
};

export const ON_EVENTS = {
    GET_ROOM_INFORMATIONS: "GET_ROOM_INFORMATIONS",
    CREATE_NICKNAME: "CREATE_NICKNAME",
    SERVER_PLAYER_READY: "SERVER_PLAYER_READY",
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    SERVER_COMPLETE_WORD: "SERVER_COMPLETE_WORD",
    SERVER_USER_INFORMATION: "SERVER_USER_INFORMATION"
};

export const EVENT_EMITTERS = {
    FIND_USER_AND_DESTROY_DEPENDENCIES: "FIND_USER_AND_DESTROY_DEPENDENCIES",
};

export const GAME = {
    GAME_TIME_IN_SECOND: 60 * 2
}

export const BASE_URL = "http://127.0.0.1:8080/api/"


const EndPoints =  {
    LOGIN: (username, password) => {
        return BASE_URL + `user/login?username=${username}&password=${password}`;
    },
    GET_BY_EMAIL: (email) => {
        return BASE_URL + `user/email/${email}`;
    },
    GET_USER_SCORES_BY_USER_ID: (userId) => {
        return BASE_URL + `userscore/user/${userId}`;
    },
    CREATE_ROOM: BASE_URL + `room`,
    CREATE_GAME: BASE_URL + `game`,
    CREATE_USER_SCORE: BASE_URL + `userscore`,
}

export default EndPoints;
