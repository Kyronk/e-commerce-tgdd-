import { createSlice } from "@reduxjs/toolkit";
// import * as actions from "./asyncProductAction";


export const userSlice = createSlice({
    name: "user",
    initialState : {
        isLoggedIn : false,
        current: null,
        token: null
    },
    reducers: {
        register: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.current = action.payload.userData;
            state.token = action.payload.token;
        }
    },
   //extraReducers: (builder) => {

        // builder.addCase(getNewProduct.pending, (state) => {
        //     state.isLoading = true
        // })

        // builder.addCase(getNewProduct.fulfilled, (state, action) => {
        //     // console.log(action);

        //     // tắt trạng thái loading, lưu dũ liệu vào store
        //     state.isLoading = false;
        //     state.newProductList = action.payload;
        // })

        // //khi thực hiện thất bại
        // builder.addCase(getNewProduct.rejected, (state, action) => {
        //     //
        //     state.isLoading = false;
        //     state.errorMessage = action.payload.message;
        // })
    //}
})

export const {register} = userSlice.actions

export default userSlice.reducer