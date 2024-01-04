import React, { useEffect } from 'react'
// import { BiDotsHorizontal } from "react-icons/bi";
import clsx from "clsx";
import { useSearchParams,  useNavigate, useParams, createSearchParams } from 'react-router-dom';


const PagiItem = ({children}) => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [params] = useSearchParams();

    // console.log(params.get("page"));

    const handlePagination = () => {
        let param = [];
        // console.log(param)
        for (let i of params.entries()) param.push(i);
        const queries = {};
        for (let i of param ) queries[i[0]] = i[1];
        if (Number(children)) queries.page = children;
        // console.log(queries)
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }

    // useEffect(() => {
    //     let param = [];
    //     for (let i of params.entries()) param.push(i);
    //     console.log(param)
    // }, [params]);
    return (
        <button className={clsx('w-10 h-10 cursor-pointer flex justify-center ', !Number(children)
            && "items-end pb-2", Number(children) && "items-center hover:rounded-full hover:bg-gray-300",
            +params.get("page") === +children && "rounded-full bg-gray-300",
            !+params.get("page") && +children === 1 && "rounded-full bg-gray-300"
        )}
        onClick={handlePagination}
        type='button'
        disabled={!Number(children)}
        >
            {children}
        </button>
    )
}

export default PagiItem;