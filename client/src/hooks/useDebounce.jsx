import React, { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
    const [deconceValue, setDeconceValue] = useState("");
    useEffect(() => {

        // const setTimeOutId = setTimeout(() => {
        //     setDeconceValue(value);
        // }, ms);
        
        const setTimeOutId = setTimeout(() => {
            setDeconceValue(value);
        }, ms)

        return () => {
            clearTimeout(setTimeOutId);
        };

    }, [value, ms])


    return deconceValue
}

export default useDebounce


// Muốn: khi mà nhập thay đổi giá trị thì sẽ phải gọi api
// vấn đề : nếu sài onChange thì cứ mỗi khi giá trị nhập thay đổi thì lại gọi api 1 lần
// réolve : chỉ gọi api khi  mà người dùng nhập xong
// thời gian onChange

// tách price thành 2 biến
// 1. biến để phục vụ UI gõ tới đâu thì lưu tới đó
// 2. biếnn thứ 2 này dùng đẻ call api =< setTimeout => gán 1 khoảng thời gian
// khi người dùng ngừng nhập thì mới gọi api 