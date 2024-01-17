import React, {memo, useCallback, useEffect, useState} from 'react'
import { InputForm, MarkdownEditor, Select, Button, Loading } from 'src/components';
import { useForm } from "react-hook-form";

import { toast } from "react-toastify"
import { getBase64, validate } from 'src/utils/helpers';
import { apiUpdateProduct } from 'src/apis';
import { useSelector , useDispatch } from "react-redux";

import { showModal } from 'src/store/app/appSlice';

const UpdateProduct = ({editProduct, render, setEditProduct}) => {
    const {categories} = useSelector(state => state.app);
    const dispatch = useDispatch();
    const {register, handleSubmit, formState: {errors}, reset, watch} = useForm();
    const [payload, setPayload] = useState({
        description: ""
    });

    // const [isFocusDescription, setIsFocusDescription] = useState(false);

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    });
    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback((e) => {
        setPayload(e);
    }, [payload]);

      // cục code này phải nằm ở trên 
    useEffect(() => {
        reset({
            title: editProduct?.title || "",
            price: editProduct?.price || "",
            quantity: editProduct?.quantity || "",
            color: editProduct?.color || "",
            category: editProduct?.category || "",
            brand: editProduct?.brand?.toLowerCase() || ""
        });
        setPayload({description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(", ") : editProduct?.description });
        setPreview({
            thumb: editProduct?.thumb || "",
            images: editProduct?.images || []
        })
    }, [editProduct]);



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




    const handleUpdateProduct = async (data) => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            if(data.category) data.category = categories?.find(el => el.title === data.category)?.title
            // console.log({...data, ...payload});
            const finalPayload = {...data, ...payload};
            // console.log(finalPayload);
            finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
            const formData = new FormData();
            for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
            finalPayload.images = data.images?.length === 0 ? preview.images : data.images;
            for (let image of finalPayload.images) formData.append("images", image)
            // if (finalPayload.thumb) formData.append("thumb", data?.thumb?.length === 0 ? preview.thumb : finalPayload.thumb[0]);
            // if (finalPayload.images) {
            //     const images = finalPayload?.image?.length === 0 ? preview.images : finalPayload.images
            //     for (let image of images) formData.append('images', image)
            // };
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading />}))
            // console.log(editProduct._id)
            const response = await apiUpdateProduct(formData, editProduct._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null}))
            // console.log(response);
            if (response.success) {
                toast.success(response.mes);
                // reset();
                render();
                // setPayload({
                //     thumb: "",
                //     image: []
                // });
                setEditProduct(null)
            } else toast.error(response.mes);
        }
    }

    // console.log(categories)
    // console.log(preview)

    // console.log(editProduct.images)
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4  border-b flex bg-gray-300 justify-between items-center right-0 left-[327px] fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Products</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setEditProduct(null)} >Cancel</span>
            </div>


            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)} >
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
                            options={categories?.map((el) => ({code: el.title, value: el.title}))}
                            register={register}
                            id="category"
                            validate={{ require: "Need fill this field"}}
                            style="flex-auto"
                            errors={errors}
                            fullWidth
                        />

                        <Select
                            label="Brand (Optional))"
                            options={categories?.find(el => el.title === watch("category"))?.brand?.map(el => ({code: el.toLowerCase(), value: el}))}
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
                        value={payload.description}
                        // setIsFocusDescription={setIsFocusDescription}
                    />

                    <div className='flex flex-col gap-2 mt-8'>
                        <label className='font-semibold' htmlFor="thumb">Upload thumb</label>
                        <input 
                            type="file" 
                            id="thumb"
                            // {...register("thumb", {required: "Need fill"})}
                            {...register("thumb")}

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
                            // {...register("images", {required: "Need fill"})}
                            {...register("images")}

                        />
                        {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                    </div>

                    {preview.images.length > 0 && <div className='my-4 flex w-full gap-3 flex-wrap'>
                            {preview.images?.map((el, idx) => (
                                <div 
                                    key={idx} 
                                    className='w-fit relative'
                                    >
                                    <img src={el} alt="product" className='w-[200px] object-contain' />
                                    
                                        {/* <div 
                                            // className='absolute animate-scale-up-center inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' >
                                            className='absolute cursor-pointer inset-0 bg-black-600/30 backdrop-brightness-75 flex justify-center items-center' 
                                            onClick={() => handleRemoveImage(el.name)}
                                            >
                                        </div> */}

                                </div>
                            ))}
                        </div>}

                    <div className='my-6'>
                        <Button
                            type="submit"
                        >Update product</Button>
                    </div>


                </form>
            </div>

        </div>
    )
}

export default memo(UpdateProduct);
