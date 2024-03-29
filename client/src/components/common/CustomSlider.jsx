import React, { useState, memo } from 'react'


import { Product } from "..";
import Slider from "react-slick";

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};

const CustomSlider = ({ productList, activeTab, normal }) => {
    // const [ productList, setProductList] = useState();
    return (
        <>
            {productList && <Slider className='customer-slider' {...settings}>
                {productList?.map((el, index) => (
                    <Product
                        key={el._id}
                        // key={index}
                        pid={el._id}
                        ProductData={el}
                        isNew={activeTab === 1 ? false : true}
                        normal={normal}
                    />
                ))}
            </Slider>

            }
        </>
    )
}


export default memo(CustomSlider)

// export default CustomSlider