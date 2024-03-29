import React, { useCallback, useEffect, useState } from 'react'

import { InputForm, Select, Button, MarkdownEditor, Loading } from 'src/components'; 
import { useForm } from "react-hook-form";

import { useSelector , useDispatch } from "react-redux";

import { validate, getBase64 } from 'src/utils/helpers';
import { toast } from "react-toastify"

import { TbTrashXFilled } from "react-icons/tb";

import { apiCreateProduct } from 'src/apis';

import { showModal } from 'src/store/app/appSlice';

const CreateProduct = () => {

    const {categories} = useSelector(state => state.app);
    const dispatch = useDispatch();
    const {register, formState: {errors}, reset, handleSubmit, watch} = useForm();

    // console.log(watch("category"));
    
    const [payload, setPayload] = useState({
        description: ""
    });
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [hoverElm, setHoverElm] = useState(null)

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
            imagesPreview.push({ name: file.name, path: base64});
        }
        // if (imagesPreview.length > 0 ) setPayload(prev => ({...prev, images: imagesPreview}))
        setPreview(prev => ({...prev, images: imagesPreview}))
    };

    const handleRemoveImage = (name) => {
        const files = [...watch("images")];
        reset({
            images: files?.filter(el => el.name !== name)
        })
        if (preview.images?.some(el => el.name === name)) setPreview(prev => ({ ...prev, images: prev.images?.filter(el => el.name !== name)}))
    }

    
    useEffect(() => {
        // console.log(watch("thumb"))
        handlePreviewThumb(watch("thumb")[0])
    }, [watch("thumb")]);

    useEffect(() => {
        // console.log(watch("thumb"))
        handlePreviewImages(watch("images"));
    }, [watch("images")]);
    
    // console.log(preview)
    const changeValue = useCallback((e) => {
        setPayload(e);
    }, [payload]);
    


    const handleCreateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if(data.category) data.category = categories?.find(el => el._id === data.category)?.title
            // console.log({...data, ...payload});
            const finalPayload = {...data, ...payload};
            // console.log(finalPayload);
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
            if (finalPayload.thumb) formData.append("thumb", finalPayload.thumb[0]);
            if (finalPayload.images) {
                for (let image of finalPayload.images) formData.append('images', image)
            };

            dispatch(showModal({ isShowModal: true, modalChildren: <Loading />}))
            const response = await apiCreateProduct(formData);
            dispatch(showModal({ isShowModal: false, modalChildren: null}))
            // console.log(response);
            if (response.success) {
                toast.success(response.mes);
                reset();
                setPayload({
                    thumb: "",
                    image: []
                });
            } else toast.error(response.mes);
        }
    }
    
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b border-gray-300'>
                <span>Create new Product</span>
            </h1>

            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateProduct)} >
                    <InputForm 
                        label="Name Product"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field"
                        }}
                        fullWidth
                        placeholder="Name of new Product"
                        
                    />

                    <div className='w-full my-6 flex gap-4'>
                        <InputForm 
                            label="Price"
                            register={register}
                            errors={errors}
                            id="price"
                            validate={{
                                required: "Need fill this field"
                            }}
                            fullWidth={true}
                            type='number'
                            style="flex-auto"
                            placeholder="Price of new Product"
                        />
                        <InputForm 
                            label="Quantity Product"
                            register={register}
                            errors={errors}
                            id="quantity"
                            validate={{
                                required: "Need fill this field"
                            }}
                            style="flex-auto"
                            // fullWidth={true}
                            placeholder="Quantity of new Product"
                            type='number'
                        />
                        <InputForm 
                            label="Color Product"
                            register={register}
                            errors={errors}
                            id="color"
                            validate={{
                                required: "Need fill this field"
                            }}
                            style="flex-auto"
                            // fullWidth={true}
                            placeholder="Color of new Product"
                            type='text'
                        />
                    </div>

                    <div className='w-full my-6 flex gap-4'>
                        <Select
                            label="Category"
                            options={categories?.map(el => ({code: el._id , value: el.title}))}
                            register={register}
                            id="category"
                            validate={{ require: "Need fill this field"}}
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        />

                        <Select
                            label="Brand (Optional))"
                            options={categories?.find(el => el._id === watch("category"))?.brand?.map(el => ({code: el, value: el}))}
                            register={register}
                            id="brand"
                            validate={{ require: "Need fill this field"}}
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        />
                    </div>

                    <MarkdownEditor 
                        name="description"
                        changeValue={changeValue}
                        label="Description"
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />

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
                                    onMouseEnter={() => setHoverElm(el.name)}
                                    onMouseLeave={() => setHoverElm(null)}
                                    >
                                    <img key={idx} src={el.path} alt="product" className='w-[200px] object-contain' />
                                    {hoverElm === el.name && 
                                        <div 
                                            // className='absolute animate-scale-up-center inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' >
                                            className='absolute cursor-pointer inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' 
                                            onClick={() => handleRemoveImage(el.name)}
                                            >
                                            
                                            <TbTrashXFilled size={24} color="white" />
                                        </div>}
                                </div>
                            ))}
                        </div>}

                    <div className='my-6'>
                        <Button
                            type="submit"
                        >Create new product</Button>
                    </div>


                </form>
            </div>
        </div>
    )
}

export default CreateProduct