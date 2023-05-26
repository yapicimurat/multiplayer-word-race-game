import endPoints from "../constant/endPoints";
import fetcher, {REQUEST_TYPE} from "./fetcher";

const login = async (username, password) => {
    return await fetcher(endPoints.LOGIN(username, password), REQUEST_TYPE.GET);
 };


export default login;
