import React, { useEffect, useState, memo } from 'react'

import { apiGetProducts } from "../../apis/product"

import { Product, CustomSlider } from "..";
// import Slider from "react-slick";
import { getNewProduct } from "../../store/product/asyncProductAction";
import { useDispatch, useSelector } from "react-redux";

const tabs = [
    { id: 1, name: "best sale" },
    { id: 2, name: "new arrivals" }
];

// const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1
// };

const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    // const [newProducts, setNewProducts] = useState(null);
    const [productList, setProductList ] = useState(null);

    const dispatch = useDispatch();
    const {newProductList} = useSelector(state => state.productList);
    // console.log(newProductList);

    const fetchProducts = async () => {
        // const response = await apiGetProducts();
        // const [bsetSellers, newProducts] = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: "-createAt"})])
        // console.log({bsetSellers, newProducts})
        // const response = await Promise.all([apiGetProducts({ sort: '-sold' }), apiGetProducts({ sort: "-createAt" })])
        // if (response[0]?.success) setBestSellers(response[0]?.productList);
        // if (response[1]?.success) setNewProducts(response[1]?.productList);
        const response = await apiGetProducts({sort: "-sold"})
        if(response.success) {
            setBestSellers(response.productList);
            setProductList(response.productList);
        }
        // if(response.success) setNewProducts(response.productList);
        // setProductList(response.productList);

    }

    useEffect(() => {
        fetchProducts()
        dispatch(getNewProduct())
    }, []);

    useEffect(() => {
        // 1 cái cục data này : 1 cái lấy ra từ lúc gọi api
        // 1 cái lấy ra trong state của redux
        if (activeTab === 1) setProductList(bestSellers);
        if (activeTab === 2) setProductList(newProductList);
    }, [activeTab])

    // console.log(bestSellers)

    return (
        <div>
            <div className='flex text-[20px] ml-[-32px]'>
                {/* <span className='font-bold capitalize border-r'>Best Seller</span> */}
                {tabs.map((el) => (
                    <span
                        // className='font-bold capitalize border-r' 
                        key={el.id}
                        className={`font-bold capitalize p-3 border-r cursor-pointer ${activeTab === el.id ? "text-black" : "text-gray-400"}`}
                        onClick={() => setActiveTab(el.id)}
                    >{el.name}</span>
                ))}
            </div>

            <div className='mt-4 mx-[-10px] border-t-2 border-red-700 pt-4'>
                {/* <Slider {...settings}>
                    {productList?.map((el, index) => (
                        <Product 
                            key={el._id}
                            // key={index}
                            pdi={el._id}
                            ProductData={el}
                            isNew={activeTab === 1 ? false : true}
                        />
                    ))}
                </Slider> */}
                <CustomSlider productList={productList} activeTab={activeTab} /> 
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

export default memo(BestSeller);