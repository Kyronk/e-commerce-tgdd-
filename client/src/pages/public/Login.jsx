import React, { useState, useCallback, useEffect } from 'react'
// import { Header } from '../../components'
import BG_Login from "../../assets/bg_login.jpg"
import { InputField, Button } from '../../components'
// import {Button} from "../../components/"
import { apiRegister, apiLogin, apiForgotPassword } from '../../apis/user'
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { useNavigate, useLocation } from "react-router-dom";
import path from '../../utils/path';
import { validate } from '../../utils/helpers';


import { login } from '../../store/user/userSlice';
import { useDispatch } from "react-redux"

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const location = useLocation();
    // console.log(location)
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: "",
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [ isRegister, setIsRegister] = useState(false);
    const [isForgetPassword, setIsForgetPassword] = useState(false)
    const resetPayload = () => {
        setPayload({
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            mobile: "",
        })
    }

    const [email, setEmail] = useState("")
    const handleForgotPassword = async () => {
        // console.log(email)
        const response = await apiForgotPassword({email});
        console.log(response)
        if(response.success) {
            toast.success(response.mes);
        }else toast.info(response.mes);
    };

    useEffect(() => {
        resetPayload()
    }, [isRegister])

    // Submit login & register
    // console.log(validate(payload));
    const handleSubmit = useCallback( async() => {
        // console.log(payload);
        const { firstname, lastname, mobile, ...data } = payload;

        const invalid = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);
        console.log(invalid)
        // console.log(data)
        // console.log(payload)
        if(invalid === 0) {
        //     if(isRegister) {
        //     const response = await apiRegister(payload)
        //     // console.log(payload)
        //     // Swal.fire(response.success? "Congratulation": "Oops!", response.mes, response.success ? "success": "error").then(() => {
        //     //     setIsRegister(false);
        //     //     resetPayload();
        //     // })
        //     if(response.success) {
        //         Swal.fire("Congratulation", response.mes, "success").then(() => {
        //             setIsRegister(false);
        //             resetPayload()
        //         });
        //     } else {Swal.fire('Oops!', response.mes, "error")}
        // } else {
        //     const response = await apiLogin(data)
        //     // console.log(data)
        //     if(response.success) {
        //         dispatch(login({isLoggedIn: true, token: response.accessToken , userData: response.userData}))
        //         resetPayload();
        //         navigate(`/${path.HOME}`)
        //         // Swal.fire("Congratulation", response.mes, "success").then(() => {
        //         //     setIsRegister(false);
        //         //     resetPayload()
        //         // });
        //     } else {Swal.fire('Oops!', response.mes, "error")}
        // }
        }

    }, [payload, isRegister]);

    return (
        <div className='w-screen h-screen relative'>
            {isForgetPassword && <div className='absolute animate-slide-right top-0 left-0  bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor="email">Enter your email:</label>
                    <input 
                        type="text"
                        id="email"
                        className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                        placeholder='Exp: email@gmail.com'
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        />
                    <div className='flex items-center justify-end w-full gap-2'>
                        <Button 
                            name="Submit"
                            handleOnClick={handleForgotPassword}
                            style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2" 
                        />

                        <Button 
                            name="Cancel"
                            // handleOnClick={handleForgotPassword}
                            handleOnClick={() => setIsForgetPassword(false)}
                        />
                    </div>
                </div>
            </div> }

            <img 
                // src="https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148865393.jpg?w=1380&t=st=1703091136~exp=1703091736~hmac=da2bcb4452d510e4ffc517bd3199474d1509c2bc5b464874edc640f0365ba147"
                src={BG_Login}
                alt=""
                className='w-full h-full object-cover'
                />    

                <div className='absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex'>
                    <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]'>
                        <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister? "Register": "Login"}</h1>
                        {isRegister && <div className='flex items-center gap-2'>
                            <InputField 
                                value={payload.firstname}
                                nameKey={'firstname'}
                                setValue={setPayload}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />
                            <InputField 
                                value={payload.lastname}
                                nameKey={'lastname'}
                                setValue={setPayload}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />   
                            
                        </div>}

                        {isRegister &&  <InputField 
                                value={payload.mobile}
                                nameKey={'mobile'}
                                setValue={setPayload}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />   }
                        <InputField 
                            value={payload.email}
                            nameKey={'email'}
                            setValue={setPayload}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />

                        <InputField 
                            value={payload.password}
                            nameKey={'password'}
                            setValue={setPayload}
                            type={"password"}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                        />


                        <Button 
                            name={isRegister ? "Register": "Login"}
                            handleOnClick={handleSubmit}
                            fw
                        />
                        
                        <div className='flex items-center justify-between my-2 w-full text-sm'>
                            {!isRegister && <span onClick={() => setIsForgetPassword(true)} className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
                            {!isRegister &&  <span 
                                className='text-blue-500 hover:underline cursor-pointer'
                                onClick={() => setIsRegister(true)}
                                >Create account</span>}

                            {isRegister &&  <span 
                                className='text-blue-500 hover:underline cursor-pointer w-full text-center'
                                onClick={() => setIsRegister(false)}
                                >Go Login</span>}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Login