import React, { useEffect, useState, useCallback } from 'react'
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from 'src/apis';

import { roles, blockStatus } from 'src/utils/contants';
import moment from 'moment';

import { InputField, Pagination, InputForm, Select, Button } from 'src/components';
import useDebounce from 'src/hooks/useDebounce';

import { useSearchParams } from 'react-router-dom';

import { useForm } from "react-hook-form";

import {toast} from "react-toastify";
import Swal from "sweetalert2";
import clsx from 'clsx';

const ManageUser = () => {

    const { handleSubmit, register, formState: { errors}, reset } = useForm({
        email: "",
        firstname: "",
        lastname: "",
        role: "",
        phone: "",
        isBlocked: ""
    })

    const [ listUser, setListUser ] = useState([])
    // const [q, setQ] = useState("");
    const [queries, setQueries] = useState({
        q: ""
    });
    const [update, setUpdate] = useState(false);
    const [editElm, setEditElm] = useState(null);
    const [params] = useSearchParams();

    // console.log(params)
    const fetchListUser = async (params) => {
        // const response = await apiGetUsers(params);
        // const response = await apiGetUsers(params);
        const response = await apiGetUsers({...params, limit: process.env.REACT_APP_LIMIT});
        // const response = await apiGetUsers({...params, limit: 2})
        // console.log(response)
        if (response.success) setListUser(response);
    };

    const render = useCallback(() => {
        setUpdate(!update);

    }, [update])



    const queriesDebounce = useDebounce(queries.q, 1000);

    // console.log(queries.q)
    // console.log(editElm);

    useEffect(() => {
        // fetchListUser({q: queriesDebounce})
        const queries = Object.fromEntries([...params]);
        // console.log(queries)
        if (queriesDebounce) queries.q = queriesDebounce;
        fetchListUser(queries)
    }, [queriesDebounce, params, update]);

    const handleUpdate = async (data) => {
        // console.log(data)
        const response = await apiUpdateUser(data, editElm._id);
        // console.log(response);
        if(response.success) {
            setEditElm(null);
            render();
            toast.success(response.mes);
        }else {
            toast.error(response.mes);
        }
    };
    // console.log(editElm)
    const handleDeleteUser = (uid) => {
        Swal.fire({
            title: "Are you sure...",
            text: "Are you ready remove this user ?",
            showCancelButton: true
        }).then(async (result) => {
            if(result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if( response.success ) {
                    render();
                    toast.success(response.mes);
                } else {
                    toast.error(response.mes);
                }
            }
        })
    }

    return (
        <div className={clsx("w-full", editElm && "pl-16")}>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300'>
                <span>Manage users</span>
            </h1>

            <div className='w-full p-4'>
                <div className='flex justify-end py-4'>
                    <InputField 
                        nameKey={"q"}
                        value={queries.q}
                        setValue={setQueries}
                        style={"w500"}
                        placeholder="Search name or email user..."
                        isHideLabel
                    />

                </div>

                <form onSubmit={handleSubmit(handleUpdate)}>
                    {editElm && <Button type="submit">Update</Button>}
                <table className='table-auto mb-6 text-left w-full'>
                    <thead className='font-bold bg-gray-700 text-[13px]  text-white'>
                        <tr className='border border-blue-500'>
                            <th className='px-4 py-2' >#</th>
                            <th className='px-4 py-2' >Email</th>
                            <th className='px-4 py-2' >First name</th>
                            <th className='px-4 py-2' >Last name</th>
                            <th className='px-4 py-2' >Role</th>
                            <th className='px-4 py-2' >Phone</th>
                            <th className='px-4 py-2' >Status</th>
                            <th className='px-4 py-2' >Created At</th>
                            <th className='px-4 py-2' >Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listUser?.listUser?.map((el,index) => (
                            <tr key={el._id} className='border border-gray-500'>
                                <td className='py-2 px-4' >{index+1}</td>
                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <InputForm 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"email"}
                                        defaultValue={editElm?.email}
                                        validate={{
                                            required: true,
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "invalid email address"
                                            }
                                        }}
                                        /> 
                                    : <span>{ el.email}</span>} 
                                </td>
                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <InputForm 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"firstname"}
                                        defaultValue={editElm?.firstname}
                                        validate={{required: "Require fill."}}
                                        /> 
                                    : <span>{ el.firstname}</span>}
                                </td>
                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <InputForm 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"lastname"}
                                        defaultValue={editElm?.lastname}
                                        validate={{required: "Require fill."}}
                                        /> 
                                    : <span>{ el.lastname}</span>}
                                </td>

                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <Select 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"role"}
                                        // defaultValue={roles.find(role => +role.code === +el.role)?.value}
                                        defaultValue={el.role}
                                        validate={{required: "Require fill."}}
                                        options={roles}
                                    /> 
                                    : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}
                                </td>
                                
                                {/* <td className='py-2 px-4' >{roles.find(role => +role.code === +el.role)?.value}</td> */}

                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <InputForm 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"mobile"}
                                        defaultValue={editElm?.mobile}
                                        validate={{
                                            required: "Require fill.",
                                            pattern: {
                                                value: /^[62|0]+\d{9}/gi,
                                                message: "Invalid phone number"
                                            }
                                        }}
                                        /> 
                                    : <span>{ el.mobile}</span>}
                                </td>

                                <td className='py-2 px-4' >
                                    { editElm?._id === el._id 
                                    ? <Select 
                                        register={register}
                                        errors={errors}
                                        fullWidth
                                        id={"isBlocked"}
                                        defaultValue={el?.isBlocked}
                                        validate={{required: "Require fill."}}
                                        options={blockStatus}
                                        /> 
                                    : <span>{el.isBlocked ? "Blocked" : "Active"}</span>}
                                </td>
                                <td className='py-2 px-4' >{moment(el.createdAt).format("DD/MM/YYYY")}</td>
                                <td className='py-2 px-4' >
                                    {editElm?._id === el._id ? <span
                                        onClick={() => setEditElm(null)} 
                                        className='px-2 text-orange-500 hover:underline cursor-pointer' >Back</span>
                                        : <span
                                        onClick={() => setEditElm(el)} 
                                        className='px-2 text-orange-500 hover:underline cursor-pointer' >Edit</span>
                                    }
                                    <span
                                        onClick={() =>  handleDeleteUser(el._id)} 
                                        className='px-2 text-orange-500 hover:underline cursor-pointer' >Delete</span>
                                </td>
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
                </form>

                <div className='w-full text-right'>
                    <Pagination 
                        totalCount={listUser?.counts}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManageUser