import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActionCurrent";


export const userSlice = createSlice({
    name: "user",
    initialState : {
        isLoggedIn : false,
        current: null,
        token: null,
        isLoading: false,
        mes: "",
        currentCart: [],

    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            // state.current = action.payload.userData;
            state.token = action.payload.token;
            // state.current = action.payload.current;
        },
        logout: (state, action) => {
            state.isLoggedIn  = false;
            state.current = null;
            state.token = null;
            state.isLoading = false;
            state.mes = "";

        },
        clearMessage: (state, action) => {
            state.mes = "";
        },
        updateCart: (state, action) => {
            // console.log(action);
            const { pid, color, quantity } = action.payload;
            // const updateItem = state.currentCart.find(el => el.color === color && el.product?._id === pid);
            const updatingCart = JSON.parse(JSON.stringify(state.currentCart));
            // console.log([...updateCart])
            const updatedCart = updatingCart.map(el => {
                if ( el.color === color && el.product?._id === pid) {
                    return { ...el, quantity }
                } else return el
            })
            state.currentCart = updatedCart;
            // if ( updateItem) updateItem.quantity = quantity;
            // else state.mes = 'Please try later'
        }
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
            state.isLoggedIn = true;
            state.currentCart = action.payload.cart;
        })

        //khi thực hiện thất bại
        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            //
            state.isLoading = false;
            state.current = action.payload.message;
            state.isLoggedIn = false;
            state.token = null;
            // state.mes = "Phiên đăng nhập hết hạn mời đăng nhập lại";
            state.mes = "Login session has expired. Please login again!";

        })
    }
})

export const { login, logout, clearMessage, updateCart } = userSlice.actions

export default userSlice.reducer