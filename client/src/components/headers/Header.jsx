import React, { Fragment, memo, useEffect, useState } from 'react'

import logo from "../../assets/logo_digi.png";
import icons from "../../utils/icons";

import { Link } from "react-router-dom";
import path from "../../utils/path";

import { useDispatch ,useSelector } from 'react-redux'
import { logout } from 'src/store/user/userSlice';

const {   MdLocalPhone,
    AiOutlineMail,
    FaShoppingBag,
    FaUser, } = icons;

const Header = () => {

    const dispatch = useDispatch();
    const { current } = useSelector(state => state.user);
    const [ isShowOption, setIsShowOption ] = useState(false);

    useEffect(() => {   
        const handleClickOutOptions = (e) => {
            // console.log(e.target);
            const profile = document.getElementById("profile");
            // console.log(profile.contains(e.target));
            if (!profile?.contains(e.target)) setIsShowOption(false);
        };

        document.addEventListener("click", handleClickOutOptions);

        return () => {
            document.removeEventListener("click", handleClickOutOptions);
        }
    }, []);

    return (
        <div className='w-main flex justify-between h-[110px] py-[35px]'>
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className='w-[234px] object-contain' />
            </Link>
            <div className="flex text-[13px]">
                <div className='flex flex-col items-center px-6 border-r'>
                    <span className="flex gap-4 items-center ">
                        <MdLocalPhone color='red'/>
                        <span className='font-semibold'>(+18000) 000 8808</span>
                    </span>
                    <span>Mon - Sat 9:00AM - 8:00PM</span>
                </div>

                <div className='flex flex-col items-center px-6 border-r'>
                    <span className='flex gap-4 items-center'>
                        <AiOutlineMail color="red"/>
                        <span className='font-semibold'>SUPPORT@TADATHEMES.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>

                {current && <Fragment>
                    <div className='flex items-center justify-center gap-2 px-6 border-r'> 
                        <FaShoppingBag color='red'/>
                        {/* <span>0 item(s)</span> */}
                        <span>{`${current?.cart?.length || 0}`} item(s)</span>
                    </div>

                    {/* <Link
                        className='flex cursor-pointer items-center justify-center px-6 gap-2'
                        to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                        >
                        <FaUser  size={24}/>
                        <span>Profile</span>
                    </Link>       */}

                    <div
                        className='flex cursor-pointer items-center justify-center px-6 gap-2 relative'
                        // to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                        onClick={() => setIsShowOption(prev => !prev)}
                        id='profile'
                        >
                        <FaUser  size={24}/>
                        <span>Profile</span>
                        {isShowOption &&  
                            <div onClick={(e) => e.stopPropagation() } className='absolute top-full flex-col flex left-[16px] bg-gray-100 border min-w-[150px] py-2'>
                                <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.MEMBER}/${path.PERSONAL}`}>Personal</Link>
                                {/* khúc này bên backend nó trả về string
                                    mà ở đây lại đi so sánh với number nên là
                                    có 2 cách 1 là đổi string thành number 
                                    2 là đổi 1945 thành "1945"
                                */}
                                {+current.role === 1945 && <Link className='p-2 w-full hover:bg-sky-100' to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                                    Admin workspace
                                </Link>}
                                <span onClick={() => dispatch(logout())} className='p-2 w-ful hover:bg-sky-100' >Logout</span>
                            </div>}
                    </div>    

                    </Fragment>}

                
            </div>

        </div>
    )
}

export default memo(Header);