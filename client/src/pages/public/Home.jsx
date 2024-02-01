import React from 'react'
import {Banner, BestSeller, Sidebar, DealDaily, FeatureProducts, CustomSlider} from "../../components";
import { useSelector } from "react-redux";
import icons from "../../utils/icons";
import ReactImageMagnify from 'react-image-magnify';
import withBaseComponent from 'src/hocs/withBaseComponent';
import { createSearchParams } from "react-router-dom";

const {MdArrowForwardIos} = icons;
const Home = ({navigate}) => {
    const { newProductList } = useSelector(state => state.productList);
    const { categories } = useSelector(state => state.app);
    const { isLoggedIn, current } = useSelector(state => state.user);
    // console.log({isLoggedIn, current})
    // console.log(categories)

    return (
        <>
            <div className='w-main flex mt-6'>
                <div className='flex flex-col gap-5 w-[25%] flex-auto '>
                    <Sidebar/>
                    {/* <span>Deal daily</span> */}

                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto ">
                    <Banner />
                    {/* <span>Best seller</span> */}
                    <BestSeller />
                </div>

            </div>

            <div className='my-8 w-main'>
                <FeatureProducts />
            </div>

            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-red-700 w-full'>
                    NEW ARRIVALS
                </h3>
                
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider 
                        productList={newProductList}
                    />
                </div>
            </div>
        
            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-red-700'>HOT COLLECTIONS</h3>
                <div className='flex flex-wrap gap-4 mt-4'>
                    {categories?.filter(el => el.brand.length > 0)?.map(el => (
                        <div 
                            className='w-[396px]'
                            key={el._id}
                            >
                            
                            <div className='border flex p-4 gap-4 min-h-[190px]'>
                                <img src={el?.image} alt="" className=' w-[144px] flex-1 h-[129px] object-cover' />
                                <div className='flex-1 text-gray-700'>
                                    <h4 className='font-semibold uppercase'>{el.title}</h4>
                                    <ul className='text-sm'>
                                        {el?.brand?.map((item, index) => (
                                            <span 
                                                key={index}
                                                // key={item}
                                                className='flex gap-1 items-center cursor-pointer hover:underline text-gray-500'
                                                onClick={() => navigate({
                                                    pathname: `/${el.title}`,
                                                    search: createSearchParams({
                                                        brand:  item,
                                                    }).toString(),
                                                })}
                                                >
                                                <MdArrowForwardIos size={14}/>
                                                <li  >{item}</li>
                                            </span>
                                        ))}
                                    </ul>                                                                   
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>

            <div className='my-8 w-main'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-red-700'>BLOG POSTS</h3>
            </div>

            {/* <div className='w-full h-[500px] bg-main'>
                FOOTER
            </div> */}
        </>
    )
}

export default withBaseComponent(Home);