import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActionCurrent";


export const userSlice = createSlice({
    name: "user",
    initialState : {
        isLoggedIn : false,
        current: null,
        token: null,
        isLoading: false,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            // state.current = action.payload.userData;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            // state.current = action.payload.userData;
            state.token = null;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        })

        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            // console.log(action);

            // tắt trạng thái loading, lưu dũ liệu vào store
            state.isLoading = false;
            state.current = action.payload;
        })

        //khi thực hiện thất bại
        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            //
            state.isLoading = false;
            state.current = action.payload.message;
        })
    }
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer