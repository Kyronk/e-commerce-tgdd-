import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis/index";

export const getNewProduct = createAsyncThunk("product/newProduct", async(data, {rejectWithValue}) => {
    const response = await apis.apiGetProducts({sort: "-createAt"});
    // console.log(response);

    if(!response.success) return rejectWithValue(response);
    return response.productList

})