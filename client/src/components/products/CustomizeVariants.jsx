import React, {memo, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { Button, InputForm, Loading } from '..';
import { getBase64 } from 'src/utils/helpers';
import { apiAddVariant } from 'src/apis';

import Swal from "sweetalert2";
import { toast } from "react-toastify"

import { useDispatch } from "react-redux";
import { showModal } from 'src/store/app/appSlice';


const CustomizeVariants = ({ customizeVariant, setCustomizeVariant, render}) => {

    // console.log(customizeVariant);
    const {register, handleSubmit, formState: {errors}, reset, watch} = useForm()

    const [ preview, setPreview ] = useState({
        thumb: "", images: []
    });

    const dispatch = useDispatch();

    useEffect(() => {
        reset({
            title: customizeVariant?.title,
            color: customizeVariant?.color,
            price: customizeVariant?.price
        })
    }, [CustomizeVariants]);

    const handlePreviewThumb = async (file) => {
        // console.log(file.type)
        const base64Thumb = await getBase64(file);
        setPreview(prev => ({...prev, thumb: base64Thumb}))
    };
    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files ) {
            // file jpg nó là jpeg
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                toast.warning("File not supported!");
                // console.log(file.type)
                return 
            }
            const base64 = await getBase64(file);
            imagesPreview.push(base64);
        }
        // if (imagesPreview.length > 0 ) setPayload(prev => ({...prev, images: imagesPreview}))
        setPreview(prev => ({...prev, images: imagesPreview}));

        // setPreview({
        //     thumb: editProduct?.thumb || "",
        //     images: editProduct?.images || []
        // })
    };


        
    useEffect(() => {
        // console.log(watch("thumb") instanceof FileList && watch("thumb").length > 0);
        // console.log(watch("thumb"))
        if (watch("thumb") instanceof FileList && watch("thumb").length > 0) {
            handlePreviewThumb(watch("thumb")[0])
        }
    }, [watch("thumb")]);

    useEffect(() => {
        // console.log(watch("thumb"))
        if ( watch("images") instanceof FileList && watch("images").length > 0 ) {
            handlePreviewImages(watch("images"));
        }
    }, [watch("images")]);



    const handleAddVariant =  async (data) => {
        // console.log(data);
        if (data.color === customizeVariant.color) Swal.fire("Oops!", "Color not changed", "info")
        else {
            const formData = new FormData();
            for (let i of Object.entries(data)) formData.append(i[0], i[1]);
            if (data.thumb) formData.append("thumb", data.thumb[0])
            if (data.images) {
                for (let image of data.images) formData.append("images", image)
            }

            dispatch(showModal({isShowModal: true, modalChildren: <Loading />}))
            const response = await apiAddVariant(formData, customizeVariant._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null}));
            // console.log(response)
            if (response.success) {
                toast.success(response.mes);
                reset();
                setPreview({thumb: "", images: []})
            } else toast.error(response.mes);
        }
    }

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4  border-b flex bg-gray-300 justify-between items-center right-0 left-[327px] fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Customize variants of product</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setCustomizeVariant(null)} >Back</span>
            </div>

            <form  onSubmit={handleSubmit(handleAddVariant)} className='p-4 w-full flex flex-col gap-4'>
                <div className="flex gap-4 items-center w-full">
                    <InputForm 
                        label="Original name"
                        register={register}
                        errors={errors}
                        id="title"
                        fullWidth
                        validate={{
                            required: "Need fill this field"
                        }}
                        placeholder="Name of Product"
                        style="flex-auto"
                        // disabled={true}
                        />
                    {/* <InputForm 
                        label="Original price"
                        register={register}
                        errors={errors}
                        id="price"
                        fullWidth
                        readOnly
                        style="flex-auto"
                        />
                    <InputForm 
                        label="Original color"
                        register={register}
                        errors={errors}
                        id="color"
                        fullWidth
                        readOnly
                        style="flex-auto"
                        /> */}
                </div>

                <div className="flex gap-4 items-center w-full">
                    <InputForm 
                        type='number'
                        label="Price Product"
                        register={register}
                        errors={errors}
                        id="price"
                        validate={{
                            required: "Need fill this field"
                        }}
                        placeholder="Price of Product"
                        fullWidth
                        style="flex-auto"
                        
                        />

                    <InputForm 
                        label="Color Product"
                        register={register}
                        errors={errors}
                        id="color"
                        validate={{
                            required: "Need fill this field"
                        }}
                        fullWidth
                        placeholder="Color of Product"
                        style="flex-auto"
                        />
                </div>

                <div className='flex flex-col gap-2 mt-8'>
                        <label className='font-semibold' htmlFor="thumb">Upload thumb</label>
                        <input 
                            type="file" 
                            id="thumb"
                            {...register("thumb", {required: "Need fill"})}
                        />
                        {errors['thumb'] && <small className='text-xs text-red-500' >{errors['thumb']?.message}</small>}
                    </div>

                    {preview.thumb && <div className='my-4'>
                            <img src={preview.thumb} alt="thumbnail" className='w-[200px] object-contain gap-2' />
                        </div>}
                    

                    <div className='flex flex-col gap-2 mt-8'>
                        <label className='font-semibold' htmlFor="products">Upload images of product</label>
                        <input 
                            type="file" 
                            id="products" 
                            multiple 
                            {...register("images", {required: "Need fill"})}
                        />
                        {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                    </div>

                    {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
                            {preview.images?.map((el, idx) => (
                                <div 
                                    key={idx} 
                                    className='w-fit relative'
                                    >
                                    <img key={idx} src={el} alt="product" className='w-[200px] object-contain' />
                                    {/* {hoverElm === el.name && 
                                        <div 
                                            // className='absolute animate-scale-up-center inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' >
                                            className='absolute cursor-pointer inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' 
                                            onClick={() => handleRemoveImage(el.name)}
                                            >
                                            
                                            <TbTrashXFilled size={24} color="white" />
                                        </div>} */}
                                </div>
                            ))}
                        </div>}

                    <div className='my-6'>
                        <Button
                            type="submit"
                        >Add variant</Button>
                    </div>
                

            </form>

        </div>
    )
}

export default memo(CustomizeVariants);