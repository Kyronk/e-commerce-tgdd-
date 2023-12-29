import React, { useState } from 'react'

import { formatMoney } from '../utils/helpers'
import label from "../assets/label.png"
import labelBlue from "../assets/label_2.png"
import { renderStarFromNumber } from "../utils/helpers";

import { SelectOption } from "./";
import icons from '../utils/icons';

import { Link } from 'react-router-dom';
import path from '../utils/path';

const { FaEye,IoMdMenu, FaHeart } = icons;

const Product = ({ProductData, isNew, normal}) => {
    // console.log(ProductData)
    const [ isShowOption, setIsShowOption] = useState(false);

    return (
        <div className='w-full  text-base px-[10px]'>
            <Link 
                to={`${ProductData?.category?.toLowerCase()}/${ProductData?._id}/${ProductData?.title}`}
                className='w-full border p-[15px] flex flex-col items-center'
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
                >
                <div className='w-full relative'>
                    {
                        isShowOption && 
                            <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                                <SelectOption icon={<FaEye />} />
                                <SelectOption icon={<IoMdMenu />} />
                                <SelectOption icon={<FaHeart /> } />
                                
                            </div>
                    }
                    <img 
                        src={ProductData?.thumb || "https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400.png"} 
                        alt="" 
                        className="w-[274px] h-[274px] object-cover" />

                    {!normal && <img 
                        src={isNew ? labelBlue : label} 
                        alt=""
                        className='absolute top-[-40px] left-[-40px] w-[100px] h-[140px] object-cover'
                        />  }
                    <span className='font-bold top-[15px] left-[-15px] text-white absolute rotate-[-30deg]'>
                        {isNew ? "New" : "Hot"}
                    </span>

                </div>
                

                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='line-clamp-1'>{ProductData?.title}</span>
                    <span className='flex h-4'>{renderStarFromNumber(ProductData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    
                    <span>{`${formatMoney(ProductData?.price)} VNĐ`} </span>
                </div>
            </Link>
        </div>
    )
}

export default Product