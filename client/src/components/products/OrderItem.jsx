import React, { useEffect, useState } from 'react'
import { formatMoney } from 'src/utils/helpers';
import { useSelector } from "react-redux";
import { SelectQuantity } from '..';


const OrderItem = ({el, handleChangeQuantities, defaultQuantity = 1}) => {

    console.log(defaultQuantity);
    // const { current } = useSelector(state => state.user);
    const [quantity, setQuantity] = useState(() => defaultQuantity);
    const handleQuantity = (number) => {
        if (+number > 1 ) setQuantity(number);
    };
    // console.log(el._id) // id này là id của giỏ hàng
    // console.log(el.product._id)

    const handleChangeQuantity = (flag) => {
        if (flag === "minus" && quantity === 1) return
        if (flag === "minus") setQuantity(prev => +prev - 1);
        if (flag === "plus") setQuantity(prev => +prev + 1);
    };

    useEffect(() => {
        handleChangeQuantities && handleChangeQuantities( el?.product?._id, quantity, el.color);
    }, [ quantity ]);

    // set Quantity

    return (
        <div className='w-main mx-auto font-bold border-b py-3 grid grid-cols-10'>
                        <span className="col-span-6 w-ful text-center">
                            <div className='flex gap-2 px-4 py-3'>
                                <img src={el?.thumbnail} alt="thumb" className='w-28 h-28 object-cover' />
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-sm text-main' >{el.title}</span>
                                    <span className='text-[10px] font-main'>{el.color}</span>
                                    {/* <span className='text-sm'>{formatMoney(el.product?.price) + " vnđ"}</span> */}
                                </div>
                            </div>
                        </span>

                        <span className='col-span-1 w-full text-center'>
                            <div className='flex items-center h-full'>
                                <SelectQuantity
                                    quantity={quantity}
                                    handleQuantity={handleQuantity}
                                    handleChangeQuantity={handleChangeQuantity}
                                />
                            </div>
                        </span>
                        <span className='col-span-3 w-full h-full flex items-center justify-center text-center'>
                            <span className='text-sm'>{formatMoney(el.price * quantity)  + " vnđ"}</span>
                        </span>
                    </div>
    )
}

export default OrderItem