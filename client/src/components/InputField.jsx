import React from 'react';


const InputField = ({value, setValue, nameKey, type, invalidFields, setInvalidFields}) => {
    // truyền thằng value, setValue luôn

    // const [forcus, setForcus ] = useState(false);
    return (
        <div className='w-full flex flex-col relative mb-2'>
            {value.trim() !== "" && <label className='text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block 
            bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input 
                type={type || "text"}
                className="px-4 py-2 rounded-sm border w-full my-2 text-sm placeholder:text-sm placeholder:italic outline-none"
                placeholder={nameKey?.slice(0,1).toUpperCase() + nameKey?.slice(1) || "..."}
                // placeholder={nameKey}
                value={value}
                onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
                onFocus={() => setInvalidFields([])}
                />


            { invalidFields?.some(el => el.name === nameKey) && 
            <small className='text-main text-[10px] italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</small> }
            {/* <small className='text-main text-[10px] italic'>Require.</small> */}
        </div>
    )
}

// [{name: password, mes: require}]

export default InputField