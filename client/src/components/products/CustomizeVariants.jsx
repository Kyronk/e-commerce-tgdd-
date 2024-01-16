import React, {memo} from 'react'
import { useForm } from 'react-hook-form';
import { InputForm } from '..';


const CustomizeVariants = ({ CustomizeVariants, setCustomizeVariant, render}) => {

    const {register, handleSubmit, formState: {errors}, reset, watch} = useForm()

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full'></div>
            <div className='p-4  border-b flex bg-gray-300 justify-between items-center right-0 left-[327px] fixed top-0'>
                <h1 className='text-3xl font-bold tracking-tight'>Customize variants of product</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setCustomizeVariant(null)} >Cancel</span>
            </div>

            <form className='p-4 w-full flex flex-col gap-4'>
                <div className="flex gap-4 items-center w-full">
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
                        readOnly
                        style="flex-auto"
                        />
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
                        readOnly
                        style="flex-auto"
                        />
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
                        readOnly
                        style="flex-auto"
                        />
                </div>

                <div className="flex gap-4 items-center w-full">
                    <InputForm 
                        label="Price Product"
                        register={register}
                        errors={errors}
                        id="title"
                        fullWidth
                        readOnly
                        style="flex-auto"
                        
                        />

                    <InputForm 
                        label="Color Product"
                        register={register}
                        errors={errors}
                        id="title"
                        validate={{
                            required: "Need fill this field"
                        }}
                        fullWidth
                        placeholder="Name of new Product"
                        readOnly
                        style="flex-auto"

                        />
                </div>

            </form>

        </div>
    )
}

export default memo(CustomizeVariants);