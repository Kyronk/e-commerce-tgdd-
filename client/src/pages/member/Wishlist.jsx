import React from 'react'
import { useSelector } from "react-redux";
import { Button, Product } from 'src/components';

const Wishlist = () => {
    const { current } = useSelector(state => state.user);

    console.log(current)
    return (
        <div className='w-full relative px-4'>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                Wishlist
            </header>

            <div className='p-4 w-full flex flex-wrap gap-4'>
                {current?.wishlist?.map((el, index) => (
                    <div key={index} className='bg-white w-[300px] rounded-md drop-shadow flex flex-col pt-3 gap-3'>
                        <Product 
                            pid={el._id}
                            ProductData={el}
                            classname="bg-white"
                        />
                        <div className='px-3'>
                            <Button>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist