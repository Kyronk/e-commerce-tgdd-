import React, { useState } from 'react'
import { Button } from "../../components";

import { useParams } from "react-router-dom"
import { toast } from "react-toastify";
import { apiResetPassword } from "../../apis/user";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const {token} = useParams();
    // console.log(token);

    const handleResetPassword = async () => {
        // console.log("pass: ",password, "token :", token) // thay vì viết như như vậy thì để cả 2 vào {}
        // console.log({password, token})
        const response = await apiResetPassword({password, token});
        // console.log(response);
        if(response.success) {
            toast.success(response.mes);
        } else toast.info(response.mes)
    }
    return (
        <div className='absolute animate-slide-right top-0 left-0  bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor="email">Enter your new password:</label>
                    <input 
                        type="password"
                        id="email"
                        className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                        placeholder='Type here'
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        />
                    <div className='flex items-center justify-end w-full gap-2'>
                        <Button 
                            name="Submit"
                            handleOnClick={handleResetPassword}
                            style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold my-2" 
                        />

                        {/* <Button 
                            name="Cancel"
                            // handleOnClick={handleForgotPassword}
                            handleOnClick={() => setIsForgetPassword(false)}
                        /> */}
                    </div>
                </div>
            </div>
    )
}

export default ResetPassword