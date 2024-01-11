import React, {memo} from 'react'
import clsx from "clsx";

const Select = ({
    label, 
    options=[], 
    register, 
    errors, 
    id, 
    validate, 
    style, 
    fullWidth, 
    defaultValue

}) => {
    return (
        <div className={clsx("flex flex-col gap-2", style)}>
            {label && <label htmlFor={id}>{label}</label>}
            <select defaultValue={defaultValue} className={clsx('form-select max-h-[46px]', fullWidth && "w-full", style)} id={id} {...register(id, validate)}>
                <option value="">---CHOOSE---</option>
                {options?.map((el, index) => (
                    <option value={el.code} key={index} >{el.value}</option>
                ))}
            </select>
            {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(Select);