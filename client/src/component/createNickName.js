import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SOCKET} from "../config";

export default function CreateNickName(){

    //get nickname
    const nickNameGlobal = useSelector(state => state.playerReducer.nickName);
    const socket = useSelector(state => state.playerReducer.socket);


    const [nickName, setNickName] = useState("");

    const changeNickNameEvent = (e) => {
        setNickName(e.target.value);
    };

    const formSubmitEvent = (e) => {
        e.preventDefault();

        if(nickName === "" && socket?.connected) return;

        socket.emit(SOCKET.EMIT_EVENTS.CREATE_NICKNAME, nickName);


    }

    const createNickNameForm = (
        <form className="createNickname" onSubmit={formSubmitEvent}>
            <small>To able to create or join a room enter your nickname!</small>
            <label htmlFor="nickName">Nickname</label>
            <input type="text" id="nickName" onChange={changeNickNameEvent} value={nickName }/>
            <button type="submit">Enter</button>
        </form>
    );

    const createdNickNameScreen = (
        <p>Hello, {nickNameGlobal}</p>
    );

    if(nickNameGlobal === ""){
        return createNickNameForm;
    }

    return createdNickNameScreen;
}
