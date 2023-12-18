import React, { useEffect, useState } from 'react'

import { apiGetProducts } from "../apis/product"

import { Product } from "./";
import Slider from "react-slick";

const tabs = [
    { id: 1, name: "best sale" },
    { id: 2, name: "new arrivals" }
];

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [newProducts, setNewProducts] = useState(null);

    const [activeTab, setActiveTab] = useState(1);

    const [productList, setProductList ] = useState(null);


    const fetchProducts = async () => {
        // const response = await apiGetProducts();
        // const [bsetSellers, newProducts] = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: "-createAt"})])
        // console.log({bsetSellers, newProducts})
        const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: "-createAt" })])
        // if (response[0]?.success) setBestSellers(response[0]?.productList);
        // if (response[1]?.success) setNewProducts(response[1]?.productList);
        if(response[0]?.success) {
            setBestSellers(response[0].productList);
            setProductList(response[0].productList);
        }
        if(response[1]?.success) setNewProducts(response[1].productList);
        setProductList(response[0].productList);

    }

    useEffect(() => {
        fetchProducts()
    }, []);

    useEffect(() => {
        if (activeTab === 1) setProductList(bestSellers);
        if (activeTab === 2) setProductList(newProducts);
    }, [activeTab])

    // console.log(bestSellers)

    return (
        <div>
            <div className='flex text-[20px] gap-8 pb-4 border-b-2 border-red-700'>
                {/* <span className='font-bold capitalize border-r'>Best Seller</span> */}
                {tabs.map((el) => (
                    <span
                        // className='font-bold capitalize border-r' 
                        key={el.id}
                        className={`font-bold capitalize border-r cursor-pointer ${activeTab === el.id ? "text-black" : "text-gray-400"}`}
                        onClick={() => setActiveTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>

            <div className='mt-4'>
                <Slider {...settings}>
                    {productList?.map((el, index) => (
                        <Product 
                            key={el._id}
                            // key={index}
                            pdi={el._id}
                            ProductData={el}
                            isNew={activeTab === 1 ? false : true}
                        />
                    ))}
                </Slider>
            </div>

            <div className='w-full flex gap-4 mt-4'>
                <img 
                    src='https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657' 
                    alt="" 
                    className='flex-1 object-contain'
                    />
                <img 
                    src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657" 
                    alt="" 
                    className='flex-1 object-contain'
                    />
            </div>

        </div>
    )
}

export default BestSeller