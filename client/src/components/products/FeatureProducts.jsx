import React, { useState, useEffect, memo } from 'react'
import { ProductCart } from "..";

import { apiGetProducts } from "../../apis";

const FeatureProducts = () => {
    const [productList, setProductsList] = useState(null);
    const fetchProducts = async () => {
        // const response = await apiGetProducts({limit: 9, page: Math.round(Math.random() * 1) });
        const response = await apiGetProducts({limit: 9, sort: "-totalRating"});
        // console.log(response)
        if(response.success) setProductsList(response.productList)
    };

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className='w-full'>
            <div className='text-[20px] font-semibold py-[15px] border-b-2 border-red-600'>
                FEATURED PRODUCTS
            </div>

            <div className='flex flex-wrap mt-[15px] mx-[10px]'>
                {productList?.map(el => (
                    <ProductCart 
                        key={el._id}
                        pid={el._id}
                        // product={el}
                        image={el.thumb}
                        {...el}
                        // totalRatings={el.totalRatings}
                        // price={el.price}
                        // title={el.title}
                    />
                ))}
            </div>

            {/* <div className='flex justify-between'>
                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661" 
                    alt="" 
                    className='w-[50%] object-contain'
                    />
                
                <div className='flex flex-col justify-between gap-4 w-[24%]'>
                    <img 
                        src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661'
                        alt=""
                        className=''
                    />
                    <img 
                        src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661" 
                        alt="" 
                        // className='h-[105%]'
                        />
                </div>

                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661" 
                    alt="" 
                    className='w-[24%] object-contain'
                    />
            </div> */}

            <div className='grid grid-cols-4 grid-rows-2 gap-4'>
                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958_600x.jpg?v=1613166661" 
                    alt="" 
                    className='w-full h-full object-cover col-span-2 row-span-2'
                    />

                <img 
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-bottom-home2_400x.jpg?v=1613166661'
                    alt=""
                    className='w-full h-full object-cover col-span-1 row-span-1'
                    />
                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd_400x.jpg?v=1613166661" 
                    alt="" 
                    className='w-full h-full object-cover col-span-1 row-span-2'
                    />
                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner3-bottom-home2_400x.jpg?v=1613166661" 
                    alt="" 
                    className='w-full h-full object-cover col-span-1 row-span-1'
                    />
                

            </div>
        </div>
    )
}

export default memo(FeatureProducts);