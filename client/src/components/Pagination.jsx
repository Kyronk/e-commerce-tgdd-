import React, { useEffect } from 'react'
import usePagination from '../hooks/usePagination'
import {PagiItem} from "./";

const Pagination = ({totalCount}) => {
    // console.log(usePagination(100,10))
    const pagination = usePagination(totalCount,2);


    return (
        <div className='flex items-center'>
            {pagination?.map((el) => (
                <PagiItem
                    key={el}
                >
                    {el}
                </PagiItem>
            ))}

        </div>
    )
}

export default Pagination