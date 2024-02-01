import React, { useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import { Route, Routes } from "react-router-dom";
import { 
    Login, 
    Home, 
    Public, 
    FAQ, 
    Services, 
    DetailProduct, 
    Products, 
    Blog,
    FinalRegister, 
    ResetPassword,
    DetailCart,
} from "./pages/public";

import {
    AdminLayout,
    CreateProduct,
    Dashboard,
    ManageOrder,
    ManageProducts,
    ManageUser
} from "./pages/admin";

import {
    MemberLayout,
    Personal,
    History,
    MyCart,
    Wishlist,
    CheckOut,
} from "./pages/member"

import path from "./utils/path";

import { getCategories } from "./store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { Cart, Modal } from './components';
import { showCart } from './store/app/appSlice';

function App() {
    const dispatch = useDispatch();
    const { isShowModal, modalChildren, isShowCart } = useSelector(state => state.app);
    // console.log(isShowModal, modalChildren);

    useEffect(() => {
        dispatch(getCategories())
    }, [])

    return (
        // <div className="min-h-screen font-main">
        <div className="font-main h-screen">
            {isShowCart && <div onClick={() => dispatch(showCart())} className='absolute inset-0 z-50 bg-black-800 backdrop-brightness-50 flex justify-end'>
                <Cart />
            </div>}
            

            {isShowModal && <Modal>{modalChildren}</Modal>}

            <Routes>    
                <Route path={path.CHECKOUT} element={<CheckOut /> }/>


                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.BLOGS} element={<Blog />} />
                    <Route path={path.DETAIL_PRODUCT_CATEGORY_PID_TITLE} element={<DetailProduct />} />
                    <Route path={path.FAQ} element={<FAQ />} />
                    <Route path={path.OUR_SERVICES} element={<Services />} />
                    <Route path={path.PRODUCTS__CATEGORY} element={<Products />} />

                    <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={path.DETAIL_CART} element={<DetailCart />} />
                    {/* <Route path={path.CHECKOUT} element={<CheckOut /> }/> */}
                    <Route path={path.ALL} element={<Home />} />


                    
                </Route>
                {/* admin */}
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.DASHBOARD}element={<Dashboard />} />
                    <Route path={path.MANAGE_ODER}element={<ManageOrder />} />
                    <Route path={path.MANAGE_PRODUCTS}element={<ManageProducts />} />
                    <Route path={path.MANAGE_USER}element={<ManageUser />} />
                    <Route path={path.CREATE_PRODUCTS}element={<CreateProduct />} />
                    
                </Route>
                
                {/* user */}
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSONAL} element={<Personal />} />
                    {/* <Route path={path.MY_CART} element={<MyCart />} /> */}
                    <Route path={path.MY_CART} element={<DetailCart />} />

                    <Route path={path.WISHLIST} element={<Wishlist />} />
                    <Route path={path.HISTORY}  element={<History /> } />
                </Route>


                <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
                <Route path={path.LOGIN} element={<Login />} />


            </Routes>



            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

        </div>
    );
}

export default App;
