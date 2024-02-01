import React, { useState, memo } from 'react'

import { BsCartCheckFill } from "react-icons/bs";

import { formatMoney } from '../../utils/helpers'
import label from "../../assets/label.png"
import labelBlue from "../../assets/label_2.png"
import { renderStarFromNumber } from "../../utils/helpers";

import { SelectOption } from "..";
import icons from '../../utils/icons';

import { Link, createSearchParams } from 'react-router-dom';
import withBaseComponent from 'src/hocs/withBaseComponent';
import { showModal } from 'src/store/app/appSlice';
import { DetailProduct } from 'src/pages/public';
import { apiUpdateCart, apiUpdateWishlist } from "src/apis";
import { useSelector} from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import path from 'src/utils/path';
import { getCurrent } from 'src/store/user/asyncActionCurrent';
import clsx from 'clsx';

const { FaEye,IoMdMenu, FaHeart, FaCartPlus } = icons;

const Product = ({
    ProductData, 
    isNew, 
    normal, 
    navigate, 
    dispatch, 
    location, 
    pid,
    classname
}) => {
    // console.log(ProductData)
    const [ isShowOption, setIsShowOption] = useState(false);
    const { current } = useSelector(state => state.user);

    const handleClickOption = async (e, flag) => {
        e.stopPropagation();
        if( flag === "CART") {

                if(!current) {
                    return Swal.fire({
                        title: "Almost...",
                        text: "Please login first!",
                        icon: 'info',
                        cancelButtonText: 'Not now!',
                        showCancelButton: true,
                        confirmButtonText: "Go login page"
                    }).then((rs) => {
                        if (rs.isConfirmed) navigate({
                            pathname: `/${path.LOGIN}`,
                            search: createSearchParams({ redirect: location.pathname}).toString(),
                        })
                    })
                }
                const response = await apiUpdateCart({ 
                    pid: ProductData?._id, 
                    color: ProductData?.color,
                    quantity: 1, 
                    price: ProductData?.price,
                    thumbnail: ProductData?.thumb,
                    title: ProductData?.title,
                });
                if (response.success) {
                    toast.success(response.mes);
                    dispatch(getCurrent())
                } else toast.error(response.mes);
            
            // if(!current) {
            //     return Swal.fire({
            //         title: "Almost...",
            //         text: "Please login first!",
            //         icon: 'info',
            //         cancelButtonText: 'Not now!',
            //         showCancelButton: true,
            //         confirmButtonText: "Go login page"
            //     }).then((rs) => {
            //         if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            //     })
            // }
            // const response = await apiUpdateCart({ pid: ProductData._id, color: ProductData.color });
            // if (response.success) {
            //     toast.success(response.mes);
            //     dispatch(getCurrent())
            // } else toast.error(response.mes);

        }
        if( flag === "WISHLIST") {
            // console.log(ProductData?._id)
            // console.log(pid)
            const response = await apiUpdateWishlist(pid);
            if (response.success) {
                dispatch(getCurrent());
                toast.success(response.mes);
            }else toast.error(response.mes);
        }
        // if( flag === "QUICK_VIEW") { 
        //     dispatch(showModal({isShowModal: true, modalChildren: <DetailProduct data={{pid: ProductData?._id, category: ProductData?.category}} isQuickView />}))
        // }
    }

    return (
        <div className={clsx('w-full  text-base px-[10px]', classname)}>
            <div
                // to={`/${ProductData?.category?.toLowerCase()}/${ProductData?._id}/${ProductData?.title}`}
                className='w-full border p-[15px] flex flex-col items-center'
                onClick={(e) => navigate(`/${ProductData?.category?.toLowerCase()}/${ProductData?._id}/${ProductData?.title}`)}
                onMouseEnter={e => {
                    e.stopPropagation()
                    setIsShowOption(true)
                }}
                onMouseLeave={e => {
                    e.stopPropagation()
                    setIsShowOption(false)
                }}
                >
                <div className='w-full relative'>
                    {
                        isShowOption && 
                            <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                                <span title="Quick view" onClick={(e) => {handleClickOption(e, "QUICK_VIEW")}} >
                                    <SelectOption icon={<FaEye />} />
                                </span>
                                {/* <span onClick={() => navigate(`/${ProductData?.category?.toLowerCase()}/${ProductData?._id}/${ProductData?.title}`)}>
                                    <SelectOption icon={<IoMdMenu />} />
                                </span> */}

                                {current?.cart?.some(el => el.product === ProductData._id.toString())
                                    ? <span title="Add to cart" >
                                        <SelectOption icon={<BsCartCheckFill color='green' />} />
                                    </span>
                                    : <span title="Add to cart" onClick={(e) => {handleClickOption(e, "CART")}}>
                                        <SelectOption icon={<FaCartPlus />} />
                                    </span>


                                }

                                {/* <span title="Add to cart" onClick={(e) => {handleClickOption(e, "CART")}}>
                                    <SelectOption icon={<FaCartPlus />} />
                                </span> */}



                                <span title='Add to wishlist' onClick={(e) => {handleClickOption(e, "WISHLIST")}} >
                                    <SelectOption icon={<FaHeart color={
                                        current?.wishlist?.some((i) => i._id === pid) 
                                        ? "red" 
                                        : "gray"
                                    } /> } />
                                </span>
                                
                            </div>
                    }
                    <img 
                        src={ProductData?.thumb || "https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400.png"} 
                        alt="" 
                        className="w-[274px] h-[274px] object-cover" />

                    {!normal && <img 
                        src={isNew ? labelBlue : label} 
                        alt=""
                        className='absolute top-[-40px] left-[-40px] w-[100px] h-[140px] object-cover'
                        />  }
                    <span className='font-bold top-[15px] left-[-15px] text-white absolute rotate-[-30deg]'>
                        {isNew ? "New" : "Hot"}
                    </span>

                </div>
                

                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='line-clamp-1'>{ProductData?.title}</span>
                    <span className='flex h-4'>{renderStarFromNumber(ProductData?.totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                    ))}</span>
                    
                    <span>{`${formatMoney(ProductData?.price)} VNĐ`} </span>
                </div>
            </div>
        </div>
    )
}

// export default memo(Product);
export default withBaseComponent(Product);
