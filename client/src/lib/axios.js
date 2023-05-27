import Axios from "axios";

const axiosInstance = Axios.create({
   headers: {
       'Authorization': "Bearer " + localStorage.getItem("access_token")
   }
});

axiosInstance.interceptors.response.use(response =>  {
    return response;
}, error => {
    if(error.response.status === 401 || error.response.status === 403) {
        console.log(localStorage.getItem("access_token"));

        //localStorage.removeItem("access_token");
        //window.location.href = "";
    }
});

axiosInstance.interceptors.request.use(request => {
    if(request.headers["Authorization"] === "Bearer null") {
        if(localStorage.getItem("access_token")) {
            console.log("girdi....");
            request.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token");
        }else {
            delete request.headers["Authorization"];
        }
    }
    return request;
}, error => {

});

export default axiosInstance;
