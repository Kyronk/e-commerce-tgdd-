import React, { useState, useCallback } from 'react'
// import { Header } from '../../components'
import BG_Login from "../../assets/bg_login.jpg"
import { InputField, Button } from '../../components'
// import {Button} from "../../components/"
import { apiRegister, apiLogin } from '../../apis/user'
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from '../../utils/path';

import { register } from '../../store/user/userSlice';
import { useDispatch } from "react-redux"

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: "",
    });
    const [ isRegister, setIsRegister] = useState(false);
    const resetPayload = () => {
        setPayload({
            email: "",
            password: "",
            firstname: "",
            lastname: "",
            mobile: "",
        })
    }

    const handleSubmit = useCallback( async() => {
        // console.log(payload);
        const {firstname, lastname, mobile, ...data} = payload;
        // console.log(data)
        // console.log(payload)
        if(isRegister) {
            const response = await apiRegister(payload)
            // console.log(payload)
            // Swal.fire(response.success? "Congratulation": "Oops!", response.mes, response.success ? "success": "error").then(() => {
            //     setIsRegister(false);
            //     resetPayload();
            // })
            if(response.success) {
                Swal.fire("Congratulation", response.mes, "success").then(() => {
                    setIsRegister(false);
                    resetPayload()
                });
            } else {Swal.fire('Oops!', response.mes, "error")}
        } else {
            const response = await apiLogin(data)
            // console.log(data)
            if(response.success) {
                dispatch(register({isLoggedIn: true, token: response.accessToken , userData: response.userData}))
                resetPayload();
                navigate(`/${path.HOME}`)
                // Swal.fire("Congratulation", response.mes, "success").then(() => {
                //     setIsRegister(false);
                //     resetPayload()
                // });
            } else {Swal.fire('Oops!', response.mes, "error")}
        }
    }, [payload, isRegister]);

    return (
        <div className='w-screen h-screen relative'>
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
                            />
                            <InputField 
                                value={payload.lastname}
                                nameKey={'lastname'}
                                setValue={setPayload}
                            />   
                            
                        </div>}

                        {isRegister &&  <InputField 
                                value={payload.mobile}
                                nameKey={'mobile'}
                                setValue={setPayload}
                            />   }
                        <InputField 
                            value={payload.email}
                            nameKey={'email'}
                            setValue={setPayload}
                        />

                        <InputField 
                            value={payload.password}
                            nameKey={'password'}
                            setValue={setPayload}
                            type={"password"}
                        />


                        <Button 
                            name={isRegister ? "Register": "Login"}
                            handleOnClick={handleSubmit}
                            fw
                        />
                        
                        <div className='flex items-center justify-between my-2 w-full text-sm'>
                            {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'>Forgot your account?</span>}
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