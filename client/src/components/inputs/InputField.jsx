import React, {memo} from 'react';
import clsx from 'clsx';

const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields, style, fullWidth, placeholder, isHideLabel}) => {
    // truyền thằng value, setValue luôn

    // const [forcus, setForcus ] = useState(false);
    return (
        <div className={clsx('flex flex-col relative mb-2', fullWidth && "w-full")}>
            {!isHideLabel && value?.trim() !== "" && <label className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block 
            bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input 
                type={type || "text"}
                className={clsx("px-4 py-2 rounded-sm border w-full my-2 text-sm placeholder:text-sm placeholder:italic outline-none", style )}
                placeholder={placeholder || nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1) || "..."}
                // placeholder={nameKey}
                value={value}
                onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
                onFocus={() => invalidFields && setInvalidFields([])}
                />


            { invalidFields?.some(el => el.name === nameKey) && 
            <small className='text-main text-[10px] italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</small> }
            {/* <small className='text-main text-[10px] italic'>Require.</small> */}
        </div>
    )
}

// [{name: password, mes: require}]

export default memo(InputField);