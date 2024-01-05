import React, { useState, useEffect, memo} from 'react'
import icons from "../../utils/icons";

import { renderStarFromNumber, formatMoney, secondsToHms } from "../../utils/helpers";
// import { formatMoney } from '../utils/helpers'

import moment from 'moment/moment';

import { apiGetProducts } from "../../apis/product";

// import { Countdown } from "./index";
import { Countdown } from ".."

const { IoIosStar, IoMdMenu } = icons;

let idInterval;

const DealDaily = () => {
    const [ DealDaily, setDealDaily ] = useState(null);
    const [ hours, setHours ] = useState(0);
    const [ minutes, setMinutes ] = useState(0);
    const [ seconds, setSeconds ] = useState(0);
    const [ expireTime, setExpireTime ] = useState(false);

    const fetchData = async () => {
        const response = await apiGetProducts({limit: 1, page: Math.round(Math.random() * 6)});
        if(response.success) {
            setDealDaily(response.productList[0]);
            // const h = 24 - new Date().getHours();
            // const m = 60 - new Date().getMinutes();
            // const s = 60 - new Date().getSeconds();
            const today = `${moment().format("MM/DD/YYYY")} 5:00:00`;
            // console.log(today)
            const second = new Date(today).getTime() - new Date().getTime() + 24 * 3600 * 1000;
            // console.log(second)
            const number = secondsToHms(second);
            setHours(number.h);
            setMinutes(number.m);
            setSeconds(number.s);
        } else {
            setHours(0);
            setMinutes(59);
            setSeconds(59);
        }
    }

    // useEffect(() => {
    //     fetchData();
    // }, [])
    // console.log(DealDaily);
    useEffect(() => {
        idInterval && clearInterval(idInterval);
        fetchData();
    }, [expireTime]);
    useEffect(() => {
        idInterval = setInterval(() => {
            // console.log("interval");
            if (seconds > 0) setSeconds(prev => prev - 1)
            else {
                if( minutes > 0) {
                    setMinutes(prev => prev - 1);
                    setSeconds(59)
                }else {
                    if (hours > 0 ) {
                        setHours(prev => prev -1);
                        setMinutes(59);
                        setMinutes(59);
                    } else {
                        setExpireTime(!expireTime)
                    }
                }
            }
        }, 1000);
        return () => {
            clearInterval(idInterval);
        }
    }, [seconds, minutes, hours]);



    return (
        <div className='border w-full flex-auto'>
            <div className='flex items-center justify-between p-4 w-full'>
                <span className='flex-1 flex justify-center'> <IoIosStar size={20} color="#DD1111" /> </span>
                <span className='flex-8 font-semibold text-[20px] flex justify-center text-gray-700'>Deal Daily </span>
                <span className='flex-1'></span>
            </div>

            <div className='w-full flex flex-col items-center pt-8 px-4 gap-2'>
                <img 
                    src={DealDaily?.thumb || "https://www.pacificfoodmachinery.com.au/media/catalog/product/placeholder/default/no-product-image-400x400.png"} 
                    alt="" 
                    className="w-[274px] h-[274px] object-cover" />

                    <span className='flex h-4 text-center'>{renderStarFromNumber(DealDaily?.totalRatings, 20)}</span>
                    <span className='line-clamp-1'>{DealDaily?.title}</span>
                    
                    {/* <span>{DealDaily?.price || 0}</span> */}
                    <span>{`${formatMoney(+DealDaily?.price)} VNĐ`} </span>

            </div>

            <div className='px-4 mt-8'>
                <div className='flex justify-center gap-2 items-center mb-4'>
                    <Countdown unit={"Hours"} number={hours}/>
                    <Countdown unit={"Minutes"} number={minutes} />
                    <Countdown unit={"Seconds"} number={seconds} />

                </div>

                <button
                    type='button'
                    className='flex gap-2 items-center justify-center w-full bg-main hover:bg-gray-800 text-white font-medium py-2'
                >
                    <IoMdMenu />
                    <span>Option</span>
                </button>

            </div>
        </div>
    )
}


export default memo(DealDaily);

// export default DealDaily