import {useEffect, useLayoutEffect, useState} from "react";
import {default as LOGIN} from "../util/login";
import {setLoggedIn, setPlayer} from "../features/player/playerSlice";
import {useDispatch, useSelector} from "react-redux";
import fetcher, {REQUEST_TYPE} from "../util/fetcher";
import EndPoints from "../constant/endPoints";
import {setRegister} from "../features/general/generalSlice";


export default function LoginScreen() {

    const [loginInformation, setLoginInformation] = useState({
        username: "",
        password: ""
    });
    const dispatch = useDispatch();
    const {socket, player, loggedIn} = useSelector(state => state.playerReducer);
    const [successfullyLogin, setSuccessfullyLogin] = useState(false);

    const valueChangeEvent = (e) => {
        setLoginInformation({
            ...loginInformation,
            [e.target.name]: e.target.value
        });
    }

    const login = async (e) => {
        e.preventDefault();

        const {username, password} = loginInformation;

        if(username === "" || password === "") {
            alert("Lütfen alanları eksiksiz doldurunuz.");
        } else {
            const {data, status, error} = await LOGIN(username, password);
            const accessToken = data["access_token"];
            if(!error) {
                localStorage.setItem("access_token", accessToken);
                dispatch(setLoggedIn(true));
                const {data, status, error} = await fetcher(EndPoints.GET_BY_EMAIL(loginInformation.username), REQUEST_TYPE.GET);
                dispatch(setPlayer(data));
            } else {
                alert("Kullanıcı adı veya parola hatalı.");
            }
        }
    }


    return (
        <form className="createRoom" onSubmit={login}>
            <label htmlFor="username">Kullanıcı adı</label>
            <input type="text" id="username" name="username" value={loginInformation.username} onChange={valueChangeEvent}/>
            <label htmlFor="password">Parola</label>
            <input type="password" id="password" name="password" value={loginInformation.password} onChange={valueChangeEvent}/>
            <span>Henüz hesabın yok mu?</span>
            <span onClick={() => {
                dispatch(setRegister(true))
        }} className="link-primary text-decoration-underline" style={{cursor: "pointer"}}>&nbsp;Kayıt ol!</span>
            <button className="btn btn-success" type="submit">Giriş Yap</button>
        </form>
    );


}
