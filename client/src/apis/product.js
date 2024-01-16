import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: "/product/list",
    method: "get",
    params
});

export const apiGetProductItem = (pid) => axios({
    url: "/product/" + pid,
    method: "get",
});

export const apiRatings = (data) => axios({
    url: "/product/ratings" ,
    method: "put",
    data
});

export const apiCreateProduct = (data) => axios({
    url: "/product/",
    method: "post",
    data
});

export const apiUpdateProduct = (data, pid) => axios({
    url: "/product/" + pid ,
    method: "put",
    data
});

export const apiDeleteProduct = (pid) => axios({
    url: "/product/" + pid,
    method: "delete"
});