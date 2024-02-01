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

export const apiAddVariant = (data, pid) => axios({
    url: "/product/variant/" + pid,
    method: "put",
    data
});


// api order
export const apiCreateOrder = (data) => axios({
    url: '/order/create',
    method: "post",
    data
});

export const apiGetUserOrders = (params) => axios({
    url: "/order/history-order",
    method: "get", 
    params
})