import React, {memo} from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
    // console.log(quantity)
    return (
        <div className='flex items-center'>
            <span
                onClick={() => handleChangeQuantity("minus")} 
                className='p-2 border-r border-black'>-</span>
            <input 
                type="text"
                className='py-2  outline-none w-[30px] text-black text-center'
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
                />

            <span 
                onClick={() => handleChangeQuantity("plus")}
                className='p-2 border-l border-black'>+</span>
        </div>
    )
}

export default memo(SelectQuantity);