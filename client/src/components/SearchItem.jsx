import React, { memo, useEffect, useState } from 'react'
import { colors } from "../utils/contants";
import icons from "../utils/icons";

import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiGetProducts } from '../apis';

import useDebounce from "../hooks/useDebounce";

const { FaChevronDown } = icons;


const SearchItem = ({ name, activeClick, changeActiveFilter, type = "checkbox" }) => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [params] = useSearchParams();
    const [selected, setSelected] = useState([]);
    const [price, setPrice] = useState({
        from: "",
        to: ""
    });
    // const [ price, setPrice] = useState([0, 0]);

    const [bestPrice, setBestPrice] = useState(0);
    // console.log(price)

    const handleSelect = (e) => {
        // console.log(e.target.value);
        const alreadyEl = selected.find(el => el === e.target.value);
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
    }

    const fetchBestPrice = async () => {
        const response = await apiGetProducts({ sort: "-price", limit: 1 });
        // console.log(response.productList[0].price)
        if (response.success) setBestPrice(response?.productList[0]?.price)
    }


    useEffect(() => {
        let param = [];
        // console.log(param)
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];
        if (selected.length > 0) {
            queries.color = selected.join(",");
            queries.page = 1;
        } else delete queries.color
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries
                //{color: selected.join(',')}
            ).toString()
        })
    }, [selected]);

    useEffect(() => {
        if (type === "input") fetchBestPrice()
    }, [type]);

    useEffect(() => {
        // if (+price.from > +price.to) alert("From price greater than To price")
        if (+price.from && +price.to && +price.from > +price.to) alert("From price cannot greater than to price");
    }, [price])

    const deboucePriceFrom = useDebounce(price.from, 500);
    const deboucePriceTo = useDebounce(price.to, 500);

    useEffect(() => {
        let param = [];
        // console.log(param)
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param) queries[i[0]] = i[1];
        // const data = {};
        if (Number(price.from) > 0) queries.from = price.from
        else delete queries.from
        if (Number(price.to) > 0) queries.to = price.to
        else delete queries.to
        queries.page = 1;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries
                //{color: selected.join(',')}
            ).toString()
        })
        // navigate({
        //     pathname: `/${category}`,
        //     search: createSearchParams(data).toString()
        // })
    }, [deboucePriceFrom, deboucePriceTo]);

    // const handlePrice = (key) => {

    // }

    return (
        <div
            className='p-3 cursor-pointer text-gray-500 text-xs gap-6 relative border border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}
        >
            <span className='capitalize'>{name}</span>
            <FaChevronDown />
            {activeClick === name &&
                <div className='absolute top-[calc(100% + 1px)] top-full left-0 w-fit p-4 border z-10 bg-white min-w-[150px]'>
                    {type === 'checkbox' && <div className=''>
                        <div className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span onClick={e => {
                                e.stopPropagation();
                                setSelected([]);
                                changeActiveFilter(null)
                            }} className='underline cursor-pointer hover:text-main'>Reset</span>
                        </div>
                        <div className='flex flex-col gap-3 mt-4'>
                            {colors?.map((el, index) => (
                                <div key={index} className='flex items-center gap-4'>
                                    <input
                                        type="checkbox"
                                        // name={el}
                                        // className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                                        value={el}
                                        id={el}
                                        onClick={handleSelect}
                                        checked={selected.some(SelectItem => SelectItem === el)}
                                        className='form-checkbox'
                                    />
                                    <label htmlFor={el}> {el}</label>
                                </div>
                            ))}
                        </div>
                    </div>}


                    {type === 'input' &&
                        <div onClick={(e) => e.stopPropagation()} >
                            <div className='p-4 items-center flex justify-between gap-8 border-b'>
                                <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND`}</span>
                                <span
                                    onClick={e => {
                                        e.stopPropagation()
                                        // setSelected([]);
                                        setPrice({ from: "", to: "" })
                                        changeActiveFilter(null)
                                    }}
                                    className='underline cursor-pointer hover:text-main'
                                >Reset</span>
                            </div>

                            <div className='flex items-center p-2 gap-2'>
                                <div className='flex items-center gap-2'>
                                    <label htmlFor="from">From</label>
                                    <input
                                        type="number"
                                        className='from-input'
                                        id="from"
                                        // value={price.from}
                                        value={price[0]}
                                        onChange={e => setPrice(prev => ({ ...prev, from: e.target.value }))}
                                    // onChange={e => setPrice(prev => prev.map((el, index) => index === 0 ? e.target.value : el) )}
                                    // onChange={(e) => handlePrice("from")}
                                    />
                                </div>

                                <div className='flex items-center gap-2'>
                                    <label htmlFor="from">To</label>
                                    <input
                                        type="number"
                                        className='from-input'
                                        id="to"
                                        // value={price.to}
                                        value={price[1]}
                                        onChange={e => setPrice(prev => ({ ...prev, to: e.target.value }))}
                                    // onChange={e => setPrice(prev => prev.map((el, index) => index === 1 ? e.target.value : el) )}
                                    // onChange={(e) => handlePrice("to")}
                                    />
                                </div>
                            </div>
                        </div>}


                </div>}
        </div>
    )
}

export default memo(SearchItem);