import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { apiGetProductItem, apiGetProducts  } from '../../apis';
import { Breadcrumb, Button, SelectQuantity, ProductExtraInfoItem, ProductInformation, CustomSlider } from "../../components";

// import { apiRatings } from '../../apis';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';

import { formatMoney, formatPrice, renderStarFromNumber } from '../../utils/helpers';

import { productExtraInformation } from "../../utils/contants";

import DOMPurify from 'dompurify';
import clsx from 'clsx';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
};


const DetailProduct = () => {
    const { pid, title, category } = useParams();
    const [product, setProduct] = useState(null);
    const [ currentImage, setCurrentImage] = useState("")

    const [quantity, setQuantity] = useState(1);
    
    const [relatedProductList, setRelatedProductList] = useState([]);
    const [update, setUpdate] = useState(false);
    const [variant, setVariant] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: "",
        thumb: "",
        images: [],
        price: "",
        color: ""
    })
    // console.log(pid, title, category);

    useEffect(() => {
        if (variant) {
            setCurrentProduct({
                title: product?.variants?.find(el => el.sku === variant)?.title,
                color: product?.variants?.find(el => el.sku === variant)?.color,
                images: product?.variants?.find(el => el.sku === variant)?.images,
                price: product?.variants?.find(el => el.sku === variant)?.price,
                thumb: product?.variants?.find(el => el.sku === variant)?.thumb
            })
        }
    }, [variant]);

    const fetchProductData = async () => {
        const response = await apiGetProductItem(pid);
        // console.log(response)
        if(response.success) {
            setProduct(response.productData);
            setCurrentImage(response.productData?.thumb)
        }
    };

    const fetchProductList = async () => {
        const response = await apiGetProducts({category});
        // console.log(response.productList)
        if(response.success) setRelatedProductList(response.productList)
    };

    useEffect(() => {
        if(pid) {
            fetchProductData();
            fetchProductList();
            };
        window.scrollTo(0,0);
    }, [pid])

    useEffect(() => {
        if(pid) fetchProductData();
    }, [update])

    const rerender = useCallback(() => {
        setUpdate(!update);
    }, [update])
    // console.log(product)
    console.log(variant)

    const handleQuantity = useCallback((number) => {
        if(!Number(number) || Number(number) < 1) {
            return;
        }else {
            setQuantity(number);
        };
    }, [quantity]);

    const handleChangeQuantity = useCallback((flag) => {
        if(flag === "minus" && quantity === 1) return
        if(flag === "minus") setQuantity(prev => +prev - 1);
        if(flag === "plus") setQuantity(prev => +prev + 1);
    }, []);

    const handleClickImage = (e,el) => {
        e.stopPropagation();
        setCurrentImage(el)
    };
    // console.log(product?.totalRatings)

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-start bg-gray-100'>
                <div className='w-main'>
                    {/* <h3 className='font-semibold'>{product?.variants?.find(el => el.sku === variant)?.title || product?.title}</h3> */}
                    {/* <Breadcrumb title={product?.variants?.find(el => el.sku === variant)?.title || product?.title} category={product?.category} /> */}
                    <h3 className='font-semibold'>{currentProduct.title || product?.title}</h3>
                    <Breadcrumb title={currentProduct.title || product?.title} category={product?.category} />
                </div>
            </div>
{/* ========================================================================================================== */}

            <div className='w-main m-auto mt-4 flex'>
                <div className='flex flex-col gap-4 w-2/5'>
                    <div className='h-[458px] w-[458px] border flex items-center overflow-hidden'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: 'Wristwatch by Ted Baker London',
                                isFluidWidth: true,
                                src: currentProduct?.thumb || currentImage
                            },
                            largeImage: {
                                src: currentProduct?.thumb || currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>
                    {/* <img src={product?.thumb} alt="product" className='w-[458px] h-[458px] object-cover' /> */}
                    <div className='w-[458px]'>
                        <Slider className='image-slider' {...settings}>
                            {currentProduct.images.length === 0 && product?.images?.map(el => (
                                <div className='flex w-full gap-2' key={el}>
                                    <img onClick={(e) => handleClickImage(e, el)} src={el} alt="sub-product" className='h-[143px] w-[143px] cursor-pointer border object-cover'  />
                                </div>
                            ))}

                            {currentProduct.images.length > 0 && currentProduct?.images?.map(el => (
                                <div className='flex w-full gap-2' key={el}>
                                    <img onClick={(e) => handleClickImage(e, el)} src={el} alt="sub-product" className='h-[143px] w-[143px] cursor-pointer border object-cover'  />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div className="w-2/5 flex pr-[24px] flex-col gap-4">
                    <div className='flex items-center justify-between'>
                        <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(currentProduct.price || product?.price))} VNĐ`}</h2>
                        <span className='text-sm text-main'>{`In stock: ${product?.quantity}`}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (<span key={index}>{el}</span>))}
                        <span className='text-sm text-main italic'> {`(Sold: ${product?.sold} prices) `}</span>
                    </div>
                    <ul className='list-square text0sm text-gray-500 pl-4'>
                        { product?.description?.length > 1 && product?.description?.map(el => (<li key={el} className='leading-6' >{el}</li>))}
                        { product?.description?.length === 1 && <div className='text-sm line-clamp-6' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description[0])}}></div> }
                    </ul>

                    <div className='my-4 flex gap-4'>
                        <span className='font-bold'>Color: </span>
                        <div className='flex flex-wrap gap-4 items-center w-full'>
                            <div 
                                onClick={() => setVariant(null)} 
                                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !variant && "border-red-500")}>
                                <img src={product?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-cover' />
                                <span className='flex flex-col'>
                                    <span>{product?.color}</span>
                                    <span className='text-sm'>{product?.price}</span>
                                </span>
                            </div>
                            {
                                product?.variants?.map(el => (
                                    <div 
                                        onClick={() => setVariant(el.sku)} 
                                        key={el.sku} 
                                        className={clsx('flex items-center gap-2 p-2 border cursor-pointer', variant === el.sku && 'border-red-500')}
                                        > 
                                        <img src={el.thumb} alt="thumb" className='w-8 h-8 rounded-mb object-cover' />
                                        <span className='flex flex-col'>
                                            <span>{el.color}</span>
                                            <span className='text-sm'>{el.price}</span>
                                        </span>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity</span>
                            <SelectQuantity 
                                quantity={quantity} 
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity}
                            />
                        </div>
                        <Button fw>
                            ADD TO CART
                        </Button>
                    </div>

                </div>
                <div className='border border-green-300 w-1/5'>
                    {productExtraInformation.map(el => (
                        <ProductExtraInfoItem 
                            key={el.id}
                            title={el.title}
                            icon={el.icon}
                            sub={el.sub}
                            />
                    ))}
                </div>
            </div>

            <div className='w-main m-auto mt-8'>
                <ProductInformation 
                    totalRatings={product?.totalRatings}
                    ratings={product?.ratings}
                    nameProduct={product?.title}
                    pid={product?._id}
                    rerender={rerender}
                    />
            </div>



            <div className='w-main m-auto mt-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-red-700'>OTHER CUSTOMERS ALSO BUY:</h3>
                <CustomSlider productList={relatedProductList} normal={true} />
            </div>

            <div className='h-[500px] w-full'></div>
        </div>
    )
}

export default DetailProduct