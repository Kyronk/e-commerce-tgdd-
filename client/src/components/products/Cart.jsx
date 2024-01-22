import React from 'react'
import { IoCloseCircleSharp } from "react-icons/io5";

const Cart = () => {
    return (
        <div className='w-[400px] max-h-screen overflow-y-auto bg-black text-white p-6'>
            <header className='py-4 border-b border-gray-500 flex justify-between items-center font-bold text-2xl'>
                <span>Your Cart</span>
                <span className='p-2 cursor-pointer'> <IoCloseCircleSharp size={24} /> </span>
            </header>
        </div>
    )
}

export default Cart