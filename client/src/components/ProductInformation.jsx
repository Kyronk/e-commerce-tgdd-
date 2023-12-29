import React, {memo, useState} from 'react'
import { productInfoTabs } from '../utils/contants'

const activedStyled = "";
const notActivedStyles = "";

const ProductInformation = () => {
    const [activedTab, setActivedTab] = useState(1)

    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[1px]'>
                {productInfoTabs.map(el => (
                    <span 
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? "bg-white border border-b-0": "bg-gray-200"}`} 
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                        >{el.name}</span>
                ))}
            </div>

            <div className='w-full border'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            </div>
        </div>
    )
}

export default ProductInformation