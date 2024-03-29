import React, {memo} from 'react'
import { formatMoney, renderStarFromNumber } from '../../utils/helpers'
import withBaseComponent from 'src/hocs/withBaseComponent';

const ProductCart = ({  price, totalRatings, title, image, pid, navigate, category }) => {
    return (
        <div 
            onClick={(e) => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
            className='w-1/3 flex-auto px-[10px] mb-[20px] cursor-pointer'
        >
            <div className='flex w-full border'>
                <img src={image} alt="" className='w-[120px] object-contain p-4' />

                <div className='flex flex-col mt-[15px] items-start gap-1 w-full text-xs'>
                    <span className='line-clamp-1 capitalize text-sm'>{title?.toLowerCase()}</span>
                    <span className='flex h-4'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>

                    <span>{`${formatMoney(+price)} VNĐ`} </span>
                </div>
            </div>

            
        </div>
    )
}

export default withBaseComponent(memo(ProductCart));