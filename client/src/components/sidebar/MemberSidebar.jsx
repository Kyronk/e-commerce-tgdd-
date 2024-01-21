import React, {memo, Fragment, useState} from 'react'
//import logo from "../../assets/logo_digi.png";
import avatarDefault from "../../assets/avatarDefault.png";


import { memberSideBar } from 'src/utils/contants';
import { NavLink, Link } from 'react-router-dom';
import clsx from "clsx";

import { FaCaretDown } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa6";

import { useSelector } from "react-redux"

const activedStyle = "px-4 py-2 flex items-center gap-2  bg-blue-300 ";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-gray-400";

const MemberSidebar = () => {
    
    const { current } = useSelector(state => state.user)
    const [actived, setActived] = useState([]);


    const handleShowTabs = (tabID) => {
        if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el !== tabID));
        else setActived(prev => [...prev, tabID])
    };
    // console.log(current);

    return (
        <div className='h-full bg-white py-4 w-[250px] flex-none'>
            <div 
                className='w-full flex flex-col items-center justify-center py-4'
                >
                <img src={current.avatar || avatarDefault} alt="" className='w-16 h-16 object-contain' />
                <span>{`${current?.lastname} ${current?.firstname}`}</span>
            </div>

            <div>
                {memberSideBar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === "SINGLE" && 
                            <NavLink
                                to={el.path}
                                className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                                >
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                            </NavLink>}

                        {el.type === "PARENT" && <div onClick={() => handleShowTabs(+el.id)} className='flex flex-col'>
                            <div className='flex items-center justify-between gap-2 px-4 py-2 hover:bg-gray-400 cursor-pointer'>
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {actived.some(id => id === +el.id) ? <FaCaretRight/> : <FaCaretDown />}
                            </div>

                            {actived.some(id => id === +el.id) &&  <div className='flex flex-col'>
                                {el.submenu.map(item => (
                                    <NavLink 
                                        key={el.id} 
                                        to={item.path}
                                        onClick={(e) => e.stopPropagation()}
                                        className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle, " pl-10")}
                                        
                                        >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>}
                        </div>
                        }

                    </Fragment>
                ))}

            </div>


        </div>
    )
}

export default memo(MemberSidebar);