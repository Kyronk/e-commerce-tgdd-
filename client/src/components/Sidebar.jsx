import React from 'react'
// import { apiGetCategories } from '../apis/app'
import { NavLink } from "react-router-dom"
import  { createSlug } from "../utils/helpers";

import {useSelector} from "react-redux";


const Sidebar = () => {

    // const [categories, setCategories] = useState(null);
    
    // const fetchCategories = async () => {
    //     const response = await apiGetCategories();
    //     if(response.success) setCategories(response.ProductCategory);
    // }

    const { categories } = useSelector(state => state.app);
    // const app = useSelector(state => state)
    // console.log(categories) 

    // useEffect(() => {
        // fetchCategories();
    // }, [])



    return (
        <div className='flex flex-col border'>
            {categories?.map((el,index) => (
                <NavLink
                    // key={index}
                    key={createSlug(el.title)}
                    to={createSlug(el.title)}
                    className={({ isActive }) => isActive ?
                "bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main"
                : "px-5 pt-[15px] pb-[14px] text-sm hover:text-main"}
                >
                    {el.title}
                </NavLink>
            ))}
        </div>
    )
}

export default Sidebar