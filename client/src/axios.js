import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // timeout: 1000,
    // headers: {'X-Custom-Header': "foobar"}
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let localStorageData = window.localStorage.getItem("persist:shop/user");
    if(localStorageData && typeof localStorageData === "string") {
        localStorageData = JSON.parse(localStorageData);
        const accessToken = JSON.parse(localStorageData.token);
        // console.log(accessToken);
        // config.headers = { authorization: `Bearer ${accessToken}`}
        config.headers = { Authorization: `Bearer ${accessToken}`}
        return config
    } else return config;
    // console.log(token);

}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error);
    return error.response.data;
});

export default instance;