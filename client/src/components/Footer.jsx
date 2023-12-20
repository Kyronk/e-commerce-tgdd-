import React, { memo } from 'react'

import icons from "../utils/icons";

const {AiOutlineMail} = icons

const Footer = () => {
    return (
        <div className='w-full'>
            <div className='h-[103px] w-full bg-main flex items-center justify-center'>
                <div className='w-main flex items-center justify-between'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>SIGN UP TO NEWSLETTER</span>
                        <span className='text-[13px] text-gray-300'>Subscribe now and receive weekly newsletter</span>
                    </div>
                    <div className='flex-1 flex items-center'>
                        <input
                            className='p-4 pr-0 rounded-l-full  w-full bg-[#F04646] outline-none text-gray-100 placeholder:text-sm 
                            placeholder:text-gray-200 placeholder: italic placeholder:opacity-5'
                            type="text" 
                            placeholder='Email Address'
                            />
                        <div className='h-[56px] w-[56px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white'>
                            <AiOutlineMail size={18}/>
                        </div>
                    </div>
                        
                </div>
            </div>
            
            <div className='h-[407px] w-full bg-gray-800 flex items-center justify-center text-white text-[13px]'>
                <div className='w-main flex items-center'>
                    <div className='flex-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-red-700 pl-[15px]'>ABOUT US</h3>
                        <span>
                            <span></span>
                            <span></span>
                        </span>
                        <span>
                            <span></span>
                            <span></span>
                        </span>
                        <span>
                            <span></span>
                            <span></span>
                        </span>
                    </div>
                    <div className='flex-1'>item 2</div>
                    <div className='flex-1'>item 3</div>
                    <div className='flex-1'>item 4</div>


                </div>
            </div>
        </div>
    )
}

export default memo(Footer);