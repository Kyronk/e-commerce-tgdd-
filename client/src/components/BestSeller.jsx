import React, {useEffect, useState}  from 'react'

import { apiGetProducts } from "../apis/product"
const BestSeller = () => {
    const [bestSellers, setBestSellers] = useState(null);
    const [newProducts, setNewProducts] = useState(null)

    const fetchProducts = async () => {
        // const response = await apiGetProducts();
        // const [bsetSellers, newProducts] = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: "-createAt"})])
        // console.log({bsetSellers, newProducts})
        const response = await Promise.all([apiGetProducts({sort: '-sold'}), apiGetProducts({sort: "-createAt"})])
        if (response[0]?.success) setBestSellers(response[0]?.productList);
        if (response[1]?.success) setNewProducts(response[1]?.productList);

    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div>BestSeller component</div>
    )
}

export default BestSeller