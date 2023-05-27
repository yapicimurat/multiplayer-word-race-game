import {useState} from "react";
import fetcher, {REQUEST_TYPE} from "../util/fetcher";
import EndPoints from "../constant/endPoints";
import {setLoggedIn, setPlayer} from "../features/player/playerSlice";
import {setRegister} from "../features/general/generalSlice";
import {useDispatch} from "react-redux";

export default function Register() {

    const [information, setInformation] = useState({
        username: "",
        password: "",
        passwordVerify: ""
    });
    const dispatch = useDispatch();

    const valueChangeEvent = (e) => {
        setInformation({
            ...information,
            [e.target.name]: e.target.value
        });
    }

    const register = async (e) => {
        e.preventDefault();

        const {username, password, passwordVerify} = information;

        if(username === "" || password === "" || passwordVerify === "") {
            alert("Lütfen tüm alanları eksiksiz doldurunuz.");
            }else {
            if(password !== passwordVerify) {
                alert("Parolalar birbirleriyle uyuşmuyor.");
            }else {
                //can be registered
                const registerBody = {
                    email: username,
                    password: password
                };

                const {data, error} = await fetcher(EndPoints.REGISTER, REQUEST_TYPE.POST, registerBody);
                if(!error) {
                    dispatch(setRegister(false));
                }else {
                    alert("Email zaten kayıtlı. Lütfen başka bir email giriniz.");
                }
            }
        }
    }

    return (
        <div className="container d-flex flex-row justify-content-center">
            <form onSubmit={register}>
                <label htmlFor="username">Kullanıcı adı</label>
                <input type="text" id="username" name="username" value={information.username} onChange={valueChangeEvent}/>
                <label htmlFor="password">Parola</label>
                <input type="password" id="password" name="password" value={information.password} onChange={valueChangeEvent}/>
                <label htmlFor="password">Parola Onay</label>
                <input type="password" id="passwordVerify" name="passwordVerify" value={information.passwordVerify} onChange={valueChangeEvent}/>
                <button className="btn btn-success" type="submit">Kayıt Ol</button>
            </form>
        </div>
    );
}
