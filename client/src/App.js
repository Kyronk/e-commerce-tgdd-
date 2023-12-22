import React, { useEffect } from 'react';
import './App.css';

import {Route, Routes} from "react-router-dom";
import {Login, Home, Public, FAQ, Services, DetailProduct, Products, Blog, FinalRegister} from "./pages/public"

import path from "./utils/path";

import { getCategories } from "./store/app/asyncAction";
import { useDispatch } from "react-redux";


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategories())
    }, [])

    return (
        <div className="min-h-screen font-main">
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route  path={path.HOME} element={<Home />}/>
                    <Route path={path.BLOGS} element={<Blog />}/>
                    <Route path={path.DETAIL_PRODUCT__PID_TITLE} element={<DetailProduct />}/>
                    <Route path={path.FAQ} element={<FAQ />}/>
                    <Route path={path.OUR_SERVICES} element={<Services />}/>
                    <Route path={path.PRODUCTS} element={<Products />}/>

                </Route>
                <Route path={path.FINAL_REGISTER} element={<FinalRegister />}/>
                <Route path={path.LOGIN} element={<Login />}/>

                
            </Routes>
        </div>
    );
}

export default App;
