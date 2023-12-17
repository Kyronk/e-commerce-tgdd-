import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: "/product/list",
    method: "get",
    params
})