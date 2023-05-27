import axiosInstance from "../lib/axios";

export const REQUEST_TYPE = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT"
}

export default async (url, type, body) => {
    const result = {
        data: {},
        status: 200,
        error: false,
        errorMessage: "",
        successMessage: "",
    };

    try {
        if(type === REQUEST_TYPE.GET) {
            const {data, status} = await axiosInstance.get(url);

            result.data = (data?.data) ? data.data : data;
            result.status = status;
            result.error = false;
            result.errorMessage = (!data.isSuccess) ? data.message : "";
            result.successMessage = (data.isSuccess) ? data.message : "";
        } else if(type === REQUEST_TYPE.POST) {
            const {data, status} = await axiosInstance.post(url, body);
            result.data = (data?.data) ? data.data : data;
            result.status = status;
            result.error = false;
            result.errorMessage = (!data.isSuccess) ? data.message : "";
            result.successMessage = (data.isSuccess) ? data.message : "";
        }

    }catch (error) {
        result.error = true;
        result.errorMessage = error.message;
        result.data = {};
        result.status = error.response.status;
        result.successMessage = "";
    }


    return result;
}
