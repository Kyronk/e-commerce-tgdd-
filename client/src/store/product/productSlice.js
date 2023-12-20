import { createSlice } from "@reduxjs/toolkit";
// import * as actions from "./asyncProductAction";
import { getNewProduct } from "./asyncProductAction"

export const productSlice = createSlice({
    name: "app",
    initialState : {
        newProductList : null,
        isLoading: false,
        errorMessage: ""
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false
        // }
    },
    extraReducers: (builder) => {

        builder.addCase(getNewProduct.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(getNewProduct.fulfilled, (state, action) => {
            // console.log(action);

            // tắt trạng thái loading, lưu dũ liệu vào store
            state.isLoading = false;
            state.newProductList = action.payload;
        })

        //khi thực hiện thất bại
        builder.addCase(getNewProduct.rejected, (state, action) => {
            //
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        })
    }
})

export const {} = productSlice.actions

export default productSlice.reducer