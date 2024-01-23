import React, { useCallback, useState } from 'react';
import { useSelector } from "react-redux";
import { Breadcrumb, Button, SelectQuantity } from 'src/components';
import { formatMoney } from 'src/utils/helpers';

const DetailCart = ({location}) => {

    const { current } = useSelector(state => state.user);
    const [quantity, setQuantity] = useState(1);
    const handleQuantity = (number) => {
        if (+number > 1 ) setQuantity(number);
    };

    const handleChangeQuantity = (flag) => {
        if (flag === "minus" && quantity === 1) return
        if (flag === "minus") setQuantity(prev => +prev - 1);
        if (flag === "plus") setQuantity(prev => +prev + 1);
    };


    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>My Cart</h3>
                    <Breadcrumb category={location?.pathname} />
                </div>
            </div>

            <div className='flex flex-col border w-main mx-auto my-8'>
                <div className='w-main mx-auto font-bold bg-gray-500 opacity-70 text-white py-3 grid grid-cols-10'>
                    <span className='col-span-6 w-full text-center'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                </div>

                {current?.cart?.map(el => (
                    <div key={el._id} className='w-main mx-auto font-bold border-b py-3 grid grid-cols-10'>
                        <span className="col-span-6 w-ful text-center">
                            <div className='flex gap-2'>
                                <img src={el.product?.thumb} alt="thumb" className='w-28 h-28 object-cover' />
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-sm text-main' >{el.product?.title}</span>
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
                            <span className='text-sm'>{formatMoney(el.product?.price)  + " vnđ"}</span>
                        </span>
                    </div>
                ))}

            </div>

            <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Subtotal:</span>
                    <span className='text-main font-bold'>{formatMoney(current?.cart?.reduce((sum,el) => sum + Number(el.product?.price), 0)) + " vnđ"}</span>
                </span>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Button>Checkout</Button>
            </div>



        </div>
    )
}

export default DetailCart