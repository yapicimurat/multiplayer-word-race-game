import Index from "./component";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import fetcher, {REQUEST_TYPE} from "./util/fetcher";
import EndPoints from "./constant/endPoints";
import {setLoggedIn, setPlayer} from "./features/player/playerSlice";

export default function App() {

  const {loggedIn, player, socket} = useSelector(state => state.playerReducer);
  const dispatch = useDispatch();



  useEffect(() => {

    if(!loggedIn && localStorage.key("access_token")) {
      (async () => {
        const {data, status, error} = await fetcher(EndPoints.GET_CURRENT_USER, REQUEST_TYPE.GET);
        dispatch(setPlayer(data));
        dispatch(setLoggedIn(true));
      })();
    }

  }, [loggedIn])

  return (

    <Index/>
  );
}


