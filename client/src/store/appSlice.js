import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";

export const appSlice = createSlice({
    name: "app",
    initialState : {
        categories : null,
        isLoading: false
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false
        // }
    },
    extraReducers: (builder) => {

        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // console.log(action);

            // tắt trạng thái loading, lưu dũ liệu vào store
            state.isLoading = false;
            state.categories = action.payload
        })

        //khi thực hiện thất bại
        builder.addCase(actions.getCategories.rejected, (state, action) => {
            //
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        })
    }
})

export const {} = appSlice.actions

export default appSlice.reducer