import React, { useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';

import { Route, Routes } from "react-router-dom";
import { Login, Home, Public, FAQ, Services, DetailProduct, Products, Blog, FinalRegister, ResetPassword } from "./pages/public"

import path from "./utils/path";

import { getCategories } from "./store/app/asyncAction";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from './components';

function App() {
    const dispatch = useDispatch();
    const { isShowModal, modalChildren } = useSelector(state => state.app);
    // console.log(isShowModal, modalChildren);

    useEffect(() => {
        dispatch(getCategories())
    }, [])

    return (
        // <div className="min-h-screen font-main">
        <div className="font-main relative">
            {isShowModal && <Modal>{modalChildren}</Modal>}

            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.BLOGS} element={<Blog />} />
                    <Route path={path.DETAIL_PRODUCT_CATEGORY_PID_TITLE} element={<DetailProduct />} />
                    <Route path={path.FAQ} element={<FAQ />} />
                    <Route path={path.OUR_SERVICES} element={<Services />} />
                    <Route path={path.PRODUCTS} element={<Products />} />

                    <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
                <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
                <Route path={path.LOGIN} element={<Login />} />


            </Routes>


            <ToastContainer
                position="top-center"
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
