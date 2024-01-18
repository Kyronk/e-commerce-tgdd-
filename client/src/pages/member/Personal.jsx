import React, { useEffect, useState } from 'react'
import { InputForm, Button } from 'src/components'
import { useForm } from 'react-hook-form'
import { useSelector } from "react-redux";
import moment from 'moment';


const Personal = () => {

    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const { current } = useSelector(state => state.user);

    useEffect(() => {
        reset({
            firstname: current?.firstname,
            lastname: current?.lastname,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar

        })
    }, [ current ]);

    const handleUpdateInfo = (data) => {
        console.log(data)
    }

    return (
        <div className='w-full relative px-4'>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                Personal
            </header>    

            <form onSubmit={handleSubmit(handleUpdateInfo)} className='w-4/5 mx-auto py-8'>
                <InputForm 
                    label="First name:"
                    register={register}
                    errors={errors}
                    id="firstname"
                    validate={{
                        required: "Need fill this field"
                    }}
                />

                <InputForm 
                    label="Last name:"
                    register={register}
                    errors={errors}
                    id="lastname"
                    validate={{
                        required: "Need fill this field"
                    }}
                />

                <InputForm 
                    label="Email Address:"
                    register={register}
                    errors={errors}
                    id="email"
                    validate={{
                        required: "Need fill this field"
                    }}
                />

                <InputForm 
                    label="Phone:"
                    register={register}
                    errors={errors}
                    id="mobile"
                    validate={{
                        required: "Need fill this field"
                    }}
                />

                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Role:</span>
                    <span>{+current?.role === 1945 ? "Admin" : "User" }</span>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Created At:</span>
                    <span>{ moment(current?.createdAt).fromNow() }</span>
                </div>
                
                <div className='w-full flex justify-end'>
                    <Button type='submit'>Update information</Button>
                </div>

            </form>
        </div>
    )
}

export default Personal