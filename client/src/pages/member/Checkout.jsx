import React, { useEffect, useState } from 'react'
import payment from "src/assets/payonline.svg";
import { useSelector } from "react-redux"
import { formatMoney } from 'src/utils/helpers';
import { Congrat, InputForm, Paypal } from 'src/components';
// import { useForm } from 'react-hook-form';
import withBaseComponent from 'src/hocs/withBaseComponent';
import { getCurrent } from 'src/store/user/asyncActionCurrent';


const Checkout = ({ dispatch, navigate }) => {

    const { currentCart, current } = useSelector(state => state.user);
    // const { register, formState: { errors }, watch, setValue } = useForm();
    // const address = watch('address');
    const [ isSuccess, setIsSuccess] = useState(false);
    // console.log(currentCart)
    // console.log(current)
    // useEffect(() => {
    //     // console.log(current.address);
    //     setValue('address', current?.address)
    // }, [current.address]);

    useEffect(() => {
        if (isSuccess) dispatch(getCurrent());
        // navigate('/');
    }, [isSuccess]);

    // console.log(address)
    // console.log(current.address)

    return (
        <div className='p-8 grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6'>

            { isSuccess && <Congrat /> }
            
            <div className='w-full flex justify-center items-center col-span-4'>
                <img src={payment} alt="payment" className='w-[70%] object-contain' />
            </div>
            {/*  */}
            <div className='flex w-full flex-col justify-center col-span-6 gap-6'>
                <h2 className='text-2xl mb-6 font-bold'>Checkout you order</h2>
                <div className='flex w-full gap-6'>
                    <div className='flex-1'>
                        <table className='table-auto h-fit'>
                            <thead>
                                <tr className='border bg-gray-200'>
                                    <th className='text-left p-2'>Products</th>
                                    <th className='text-center p-2'>Quantity</th>
                                    <th className='text-right p-2'>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCart?.map(el => (
                                    <tr className='border' key={el._id}>
                                        <td className='text-left p-2'>{el.title}</td>
                                        <td className='text-center p-2'>{el.quantity}</td>
                                        <td className='text-right p-2'>{formatMoney(el.price) + "VND"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='flex-1 flex flex-col justify-between gap-[45px]'>
                        <div>
                            <span className='flex items-center gap-8 text-sm'>
                                <span>Subtotal:</span>
                                {/* <span className='text-main font-bold'>{formatMoney(current?.cart?.reduce((sum,el) => sum + Number(el.product?.price), 0)) + " vnđ"}</span> */}
                                <span className='text-main font-bold'>
                                    {/* {formatMoney(currentCart?.reduce((sum,el) => sum + +el?.price, 0)) + " vnđ"} */}
                                    {formatMoney(currentCart?.reduce((sum, el) => sum + (+el?.price * el?.quantity), 0)) + " vnđ"}
                                </span>
                            </span>
                            <span className='flex items-center gap-8 text-sm'>
                                <span>Address:</span>
                                <span className='text-main font-bold'>
                                    {/* {formatMoney(currentCart?.reduce((sum, el) => sum + (+el?.price * el?.quantity), 0)) + " vnđ"} */}
                                    {current?.address}
                                </span>
                            </span>
{/* 
                            <InputForm
                                label="Your address"
                                register={register}
                                errors={errors}
                                id="address"
                                validate={{
                                    required: "Need fill this field"
                                }}
                                fullWidth
                                placeholder="Please type your address for ship"
                                style="text-sm"
                            /> */}

                            {/* <div>
                                input address
                            </div> */}

                            {/* {address && address?.length > 10 &&  */}
                                <div className='w-full mx-auto gap-4'>
                                    <Paypal
                                        payload={{
                                            products: currentCart,
                                            total: Math.round(+currentCart?.reduce((sum, el) => sum + (+el?.price * el?.quantity), 0) / 23500),
                                            // orderBy: current?._id,
                                            address: current?.address
                                        }}
                                        setIsSuccess={setIsSuccess}
                                        amount={Math.round(+currentCart?.reduce((sum, el) => sum + (+el?.price * el?.quantity), 0) / 23500)} // giá tiền
                                    />
                            </div>
                            {/* } */}

                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default withBaseComponent(Checkout);   