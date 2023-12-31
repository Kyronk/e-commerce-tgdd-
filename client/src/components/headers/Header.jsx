import React, { Fragment, memo } from 'react'

import logo from "../../assets/logo_digi.png";
import icons from "../../utils/icons";

import { Link } from "react-router-dom";
import path from "../../utils/path";

import { useSelector } from 'react-redux'

const {   MdLocalPhone,
    AiOutlineMail,
    FaShoppingBag,
    FaUser, } = icons;

const Header = () => {

    const { current } = useSelector(state => state.user);

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
                        <span>0 item(s)</span>
                    </div>

                    <Link
                        className='flex cursor-pointer items-center justify-center px-6 gap-2'
                        to={+current?.role === 1945 ? `/${path.ADMIN}/${path.DASHBOARD}` : `/${path.MEMBER}/${path.PERSONAL}`}
                        >
                        <FaUser  size={24}/>
                        <span>Profile</span>
                    </Link>                         
                    </Fragment>}

                
            </div>

        </div>
    )
}

export default memo(Header);