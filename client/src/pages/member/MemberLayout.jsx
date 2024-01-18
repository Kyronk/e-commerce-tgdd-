import React from 'react'
import { Outlet, Navigate } from "react-router-dom";
import path from 'src/utils/path';
import { useSelector } from "react-redux";
import { MemberSidebar } from 'src/components';

const MemberLayout = () => {

    const { isLoggedIn, current } = useSelector(state => state.user);
    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true}  /> 

    return (
        <div className='flex'>
            <MemberSidebar />
            <div className='flex-auto bg-gray-50 min-h-screen'>
                <Outlet />

            </div>
        </div>
    )
}

export default MemberLayout