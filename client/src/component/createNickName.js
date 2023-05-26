import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SOCKET} from "../config";
import {setCreateRoomForm} from "../features/general/generalSlice.js";

export default function CreateNickName(){


    const dispatch = useDispatch();

    //get nickname
    const nickNameGlobal = useSelector(state => state.playerReducer.nickName);
    const {socket, player} = useSelector(state => state.playerReducer);

    const [nickName, setNickName] = useState("");

    const changeNickNameEvent = (e) => {
        setNickName(e.target.value);
    };

    const formSubmitEvent = (e) => {
        e.preventDefault();

        if(nickName === "" && socket?.connected) return;

        socket.emit(SOCKET.EMIT_EVENTS.CREATE_NICKNAME, {
            nickName: nickName,
            id: player.id
        });
    }

    const createRoomFormOpenEvent = () => {
        dispatch(setCreateRoomForm(true));
    };

    const createNickNameForm = (
        <>
            <div className="container d-flex flex-row justify-content-center border-bottom border-1 text-center p-2">
                <form className="mx-auto" onSubmit={formSubmitEvent}>
                    <small>Herhangi bir odaya katılabilmek için isim oluşturmalısın.</small>
                    <label className="form-label" htmlFor="nickName">Takma İsim</label>
                    <input className="form-control" type="text" id="nickName" onChange={changeNickNameEvent} value={nickName }/>
                    <button type="submit" className="btn btn-primary">Onayla</button>
                </form>
            </div>
        </>
    );


    const createdNickNameScreen = (
        <>
            <p>Merhaba, {nickNameGlobal} <span><button className="btn btn-success" type="button" onClick={createRoomFormOpenEvent}>Oda Oluştur</button></span></p>
        </>
    );



    if(nickNameGlobal === ""){
        return createNickNameForm;
    }

    return createdNickNameScreen;
}

