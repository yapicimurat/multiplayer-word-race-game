export const SOCKET = {
    URL: '127.0.0.1:3000',
    EMIT_EVENTS: {
        GET_ROOM_INFORMATIONS: "GET_ROOM_INFORMATIONS",
        CREATE_NICKNAME: "CREATE_NICKNAME",
        CREATE_ROOM: "CREATE_ROOM",
        JOIN_ROOM: "JOIN_ROOM"
    },
    ON_EVENTS: {
        CONNECT: "connect",
        CLIENT_ROOM_INFORMATIONS: "CLIENT_ROOM_INFORMATIONS",
        CREATE_NICKNAME: "CREATE_NICKNAME",
        CREATE_ROOM: "CREATE_ROOM",
        JOIN_ROOM: "JOIN_ROOM",
    },

}