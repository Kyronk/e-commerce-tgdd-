import axios from "../axios";

export const apiRegister = (data) => axios({
    url: "/user/register",
    method: "post",
    data,
    withCredentials: true,
});

export const apiFinalRegister = (token) => axios({
    url: "/user/finalregister/" + token,
    method: "put",
    
});

export const apiLogin = (data) => axios({
    url: "/user/login",
    method: "post",
    data
});

export const apiForgotPassword = (data) => axios({
    url: "/user/forgetpassword",
    method: "post",
    data
});

export const apiResetPassword = (data) => axios({
    url: "/user/resetpassword",
    method: "put",
    data
});

export const apiCurrentUser = (data) => axios({
    url: "/user/current",
    method: "get",
    data
});

export const apiGetUsers = (params) => axios({
    url: "/user/getusers",
    method: "get",
    params
});


