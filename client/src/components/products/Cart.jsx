import React, { memo } from 'react'
import { IoCloseCircleSharp } from "react-icons/io5";
import withBaseComponent from 'src/hocs/withBaseComponent';
import { showCart } from 'src/store/app/appSlice';
import { useSelector } from "react-redux";
import { formatMoney, formatPrice } from 'src/utils/helpers';
import { Button } from 'src/components/index';
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiRemoveCart, apiUpdateCart } from 'src/apis';
import { getCurrent } from 'src/store/user/asyncActionCurrent';
import path from 'src/utils/path';

const Cart = ({dispatch, navigate}) => {
    
    const { currentCart } = useSelector(state => state.user);
    console.log(currentCart)

    const removeCart = async (id, color) => {
        const response = await apiRemoveCart(id, color);
        if (response.success) {
            // toast.success(response.mes);
            dispatch(getCurrent())
        } else toast.error(response.mes);

    }

    return (
        // <div onClick={(e) => e.stopPropagation()} className='w-[400px] max-h-screen overflow-y-auto bg-black text-white p-6'>
        <div onClick={(e) => e.stopPropagation()} className='w-[400px] h-screen overflow-y-auto bg-black grid grid-rows-10 text-white p-6'>
            <header className='py-4 border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl'>
                <span>Your Cart</span>
                <span onClick={() => dispatch(showCart())} className='p-2 cursor-pointer'> <IoCloseCircleSharp size={24} /> </span>
            </header>

            <section className='row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3'>
                {!currentCart && <span className='text-xs italic'> Your cart is empty. </span>}
                {currentCart && currentCart?.map(el => (
                    <div key={el._id} className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <img src={el.thumbnail} alt="thumb" className='w-16 h-16 object-cover' />
                            <div className='flex flex-col gap-1'>
                                <span className='text-sm text-main'>{el.title}</span>
                                <span className='text-[10px]'>{el.color}</span>
                                <span className='text-[10px]'>Quantity: {el.quantity}</span>
                                <span className='text-sm'>{formatMoney(el.price)  + " vnđ"}</span>
                            </div>
                        </div>
                        <span
                            onClick={() => removeCart(el.product?._id, el.color)} 
                            className='h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer'>
                            <FaTrashAlt size={16}/>
                        </span>
                    </div>
                ))}
            </section>

            <div className='row-span-2 flex flex-col justify-between h-full'>
                <div className='flex items-center justify-between pt-4 border-t'>
                    <span>Subtotal:</span>
                    <span>{formatMoney(currentCart?.reduce((sum,el) => sum + Number(el.price) * el.quantity, 0)) + " vnđ"}</span>
                </div>
                <span className='text-center text-gray-700 italic text-xs'>
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <Button 
                    handleOnClick={() => {
                        dispatch(showCart())
                        navigate(`/${path.MEMBER}/${path.DETAIL_CART}`)
                    }}             
                    style='rounded-none w-full bg-main py03 '>Shopping Cart</Button>
            </div>
        </div>
    )
}

export default withBaseComponent(memo(Cart))