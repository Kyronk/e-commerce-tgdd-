import React, { memo } from 'react'

const Button = ({ children ,name, handleOnClick, style, iconsBefore, iconsAfter, fw, type = 'button' }) => {
    return (
        <button
            type={type}
            className={style ? style : `px-4 py-2 rounded-md text-white bg-main text-semibold my-2 ${fw ? "w-full": "w-fit"}`}
            onClick={() => { handleOnClick && handleOnClick()}}
        >
            {/* {iconsBefore}
            <span>{name}</span>
            {iconsAfter} */}
            {children}
        </button>
    )
}

export default memo(Button);