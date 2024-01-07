// action này là call api và get dữ liệu của bản thân chính user đó
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis/index";

export const getCurrent = createAsyncThunk("user/current", async(data, {rejectWithValue}) => {
    const response = await apis.apiCurrentUser();
    // console.log(response);

    if(!response.success) return rejectWithValue(response);
    return response.rs;

})