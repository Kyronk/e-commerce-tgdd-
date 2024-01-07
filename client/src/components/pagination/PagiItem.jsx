import React, { useEffect, memo } from 'react'
// import { BiDotsHorizontal } from "react-icons/bi";
import clsx from "clsx";
import { useSearchParams,  useNavigate, createSearchParams, useLocation } from 'react-router-dom';


const PagiItem = ({children}) => {
    const navigate = useNavigate();
    // const { category } = useParams();
    const location = useLocation();
    const [params] = useSearchParams();

    // console.log(params)
    // console.log(params.get("page"));

    const handlePagination = () => {
        // let param = [];
        // // console.log(param)
        // for (let i of params.entries()) param.push(i);
        // const queries = {};
        // for (let i of param ) queries[i[0]] = i[1];
        const queries = Object.fromEntries([...params]);
        console.log(queries);
        if (Number(children)) queries.page = children;
        navigate({
            // pathname: `/${category}`,
            pathname: location.pathname,
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

export default memo(PagiItem);