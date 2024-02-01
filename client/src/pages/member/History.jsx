import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { apiGetUserOrders } from 'src/apis';
import { CustomSelect, InputForm, Pagination } from 'src/components';
import withBaseComponent from 'src/hocs/withBaseComponent';
import { statusOrder } from 'src/utils/contants';

const History = ({ navigate, location }) => {

    const [orderList, setOrderList] = useState([]);
    const [counts, setCounts] = useState(0);
    const [params] = useSearchParams();

    // console.log(statusOrder)
    const { register, formState: { errors }, watch, setValue } = useForm();

    const q = watch("q");
    const status = watch("status");

    const fetchProducts = async (params) => {
        const response = await apiGetUserOrders({
            ...params,
            limit: process.env.REACT_APP_LIMIT,
        });
        // console.log(response);
        if (response.success) {
            setCounts(response.counts)
            setOrderList(response.order)
        }
    };

    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchProducts(pr)
    }, [params]);


    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }

    console.log(status);

    return (
        <div className='w-full relative px-4'>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                History
            </header>
            <div className='flex w-full justify-end items-center px-4'>
                <form
                    className='w-[45%] grid grid-cols-2 gap-4'
                //onSubmit={handleSubmit(handleSearchProducts)} 
                >
                    <div className='col-span-1'>
                        <InputForm
                            id='q'
                            register={register}
                            errors={errors}
                            fullWidth
                            placeholder="Search order by status ..."

                        />
                    </div>


                    <div className='col-span-1 flex items-center'>
                        <CustomSelect
                            options={statusOrder}
                            value={status}
                            // onChange={(val) => setValue("status", val)}
                            onChange={(val) => handleSearchStatus(val)}
                            classname="col-span-1"
                            wrapClassname="w-full"
                        />
                    </div>
                </form>
            </div>

            <table className='table-auto w-full'>
                <thead>
                    <tr className='border bg-sky-900 text-white border-white'>
                        <th className='text-center py-2'>#</th>
                        <th className='text-center py-2'>Product</th>
                        <th className='text-center py-2' >Total</th>
                        <th className='text-center py-2' >Status</th>
                        <th className='text-center py-2' >Created At</th>
                        {/* <th className='text-center py-2' >Actions</th> */}

                    </tr>
                </thead>

                <tbody>
                    {orderList?.map((el, idx) => (
                        <tr key={el._id}>

                            <td className='text-center py-2' >
                                {((+params.get("page") > 1 ? +params.get("page") - 1 : 0) * process.env.REACT_APP_LIMIT) + idx + 1}
                            </td>
                            {/* <td className='text-center py-2' >
                                <span className='flex flex-col '>
                                    {el.products?.map((item) => (
                                        <span key={item._id}>
                                            {` • ${item.title} - ${item.color}`}

                                        </span>
                                    ))}
                                </span>
                            </td> */}
                            <td className='text-center max-w-[500px] py-2'>
                                <span className='grid grid-cols-4 gap-4'>
                                    {el.products?.map((item) => (
                                        <span
                                            className='flex col-span-1 items-center gap-2'
                                            key={item._id}
                                        >
                                            <img 
                                                src={item.thumbnail} 
                                                alt="thumb"
                                                className="w-8 h-8 rounded-md object-cover"
                                                />
                                            <span className='flex flex-col'>
                                                <span className='text-main text-sm'>{item.title}</span>
                                                <span className='flex items-center text-xs gap-2'>
                                                    <span>Quantity: </span>
                                                    <span className='text-main'>{item.quantity}</span>
                                                </span>
                                            </span>
                                            
                                        </span>
                                    ))}
                                </span>
                            </td>
                            <td className='text-center py-2' >{el.total + " $"}</td>
                            <td className='text-center py-2' >{el.status}</td>
                            <td className='text-center py-2' >{moment(el.createdAt)?.format("DD/MM/YYYY")}</td>

                            {/* <td className='text-center py-2'>
                                <span onClick={() => setEditProduct(el)} className='text-blue-500 inline-block hover:underline hover:text-orange-500 cursor-pointer px-1'>
                                    <FaEdit size={20}/>
                                </span>
                                <span onClick={() => handleDeleteProduct(el._id)} className='text-blue-500 inline-block hover:text-orange-500 hover:underline cursor-pointer px-1'>
                                    <IoTrashBin size={20} />
                                </span>
                                <span onClick={() => setCustomizeVariant(el)} className='text-blue-500 inline-block hover:text-orange-500 hover:underline cursor-pointer px-1'>
                                    <MdOutlineDashboardCustomize size={20} />
                                </span>
                            </td>  */}
                            
                            {/* <td className='text-center py-2' >{el.title}</td>
                            <td className='text-center py-2' >{el.brand}</td>
                            <td className='text-center py-2' >{el.category}</td>
                            <td className='text-center py-2' >{el.price}</td>
                            <td className='text-center py-2' >{el.quantity}</td>
                            <td className='text-center py-2'>{el.sold}</td>
                            <td className='text-center py-2'>{el.color}</td>
                            <td className='text-center py-2'>{el.totalRatings}</td>
                            <td className='text-center py-2'> {el?.variants?.length}</td>
                            <td className='text-center py-2'>{moment(el.createdAt).format("DD/MM/YYYY")}</td>
                            <td className='text-center py-2'>
                                <span onClick={() => setEditProduct(el)} className='text-blue-500 inline-block hover:underline hover:text-orange-500 cursor-pointer px-1'>
                                    <FaEdit size={20}/>
                                </span>
                                <span onClick={() => handleDeleteProduct(el._id)} className='text-blue-500 inline-block hover:text-orange-500 hover:underline cursor-pointer px-1'>
                                    <IoTrashBin size={20} />
                                </span>
                                <span onClick={() => setCustomizeVariant(el)} className='text-blue-500 inline-block hover:text-orange-500 hover:underline cursor-pointer px-1'>
                                    <MdOutlineDashboardCustomize size={20} />
                                </span>
                            </td> */}


                        </tr>
                    ))}
                </tbody>

            </table>

            <div className='w-full flex justify-end my-8'>
                <Pagination
                    totalCount={counts}
                />
            </div>

        </div>
    )
}

export default withBaseComponent(History);