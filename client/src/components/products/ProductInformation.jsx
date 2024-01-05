import React, { memo, useCallback, useState } from 'react'
import { productInfoTabs } from '../../utils/contants'
import { apiRatings } from '../../apis';

import { renderStarFromNumber } from '../../utils/helpers';

import { Votebar, Button, VoteOption, Comment } from ".."
import Swal from "sweetalert2";
import path from '../../utils/path';
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux"
import { showModal } from '../../store/app/appSlice';
// const activedStyled = "";
// const notActivedStyles = "";

const ProductInformation = ({ totalRatings, ratings, nameProduct, pid, rerender }) => {
    const [activedTab, setActivedTab] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector(state => state.user);

    const [payload, setPayload] = useState({
        comment: "",
        score: ""
    });

    const handleSubmitVoteOption = async ({ comment, score }) => {
        // console.log({ comment, score, pid});
        // console.log(value)
        if (!comment || !pid || !score) {
            alert("please vote when click submit");
            return;
        }
        await apiRatings({ star: score, comment, pid, updatedAt: Date.now() });
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        rerender();

    };
    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: "Login to vote",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                confirmButtonText: "Go login",
                title: "Oops!",
            }).then((rs) => {
                if (rs.isConfirmed) navigate(`/${path.LOGIN}`)
            })
        } else {
            dispatch(
                showModal({
                    isShowModal: true,
                    modalChildren: <VoteOption
                        nameProduct={nameProduct}
                        handleSubmitVoteOption={handleSubmitVoteOption}
                    />
                })
            )
        }
    }

    // const handSubmitVoteOption = useCallback((value) => {
    //     console.log(value);
    // }, [])
    // console.log(isVote);
    return (
        <div >
            {/* {isVote && 
                <div className='absolute z-50 inset-0 opacity-1 bg-black opacity-50 '>
                    model
                </div>
            } */}

            <div className='flex items-center gap-2 relative bottom-[1px]'>
                {productInfoTabs.map(el => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? "bg-white border border-b-0" : "bg-gray-200"}`}
                        key={el.id}
                        onClick={() => setActivedTab(el.id)}
                    >{el.name}</span>
                ))}

                {/* <span 
                        className={`py-2 px-4 cursor-pointer ${activedTab === 5 ? "bg-white border border-b-0": "bg-gray-200"}`} 
                        // key={el.id}
                        onClick={() => setActivedTab(5)}
                        >CUSTOMER REVIEW</span> */}

            </div>

            <div className='w-full border'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}


            </div>

            <div className='flex flex-col py-8 w-main'>
            

                <div className='flex border'>
                    <div className='flex-4 flex flex-col items-center justify-center border border-red-500'>
                        <span className='font-semibold text-3xl' >{`${totalRatings}/5`}</span>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el, index) => (
                            <span key={index} >{el}</span>
                        ))}</span>
                        <span className='text-sm' >{`${ratings?.length} reviews and commentors`} </span>
                    </div>

                    <div className='flex-6 border flex gap-2 flex-col p-4'>
                        {Array.from(Array(5).keys()).reverse().map(el => (
                            <Votebar
                                key={el}
                                number={el + 1}
                                ratingTotal={ratings?.length}
                                ratingCount={ratings?.filter(i => i.star === el + 1)?.length}
                            />
                        ))}
                    </div>
                </div>
                <div className='p-4 flex items-center justify-center text-sm flex-col gap-2'>
                    <span>Do you review this product?</span>
                    <Button
                        handleOnClick={handleVoteNow}
                    // handleOnClick={() => dispatch(
                    //     showModal({
                    //         isShowModal: true, 
                    //         modalChildren: <VoteOption 
                    //                             nameProduct={nameProduct} 
                    //                             handleSubmitVoteOption={handleSubmitVoteOption}
                    //                         />}))} 


                    >Vote now!</Button>
                </div>

                <div className='flex flex-col gap-4'>
                    {
                        ratings?.map(el => (
                            <Comment
                                key={el._id}
                                star={el.star}
                                updatedAt={el.updatedAt}
                                comment={el.comment}
                                name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                            />
                        ))
                    }
                </div>
            </div>

        </div>
    )
}

export default memo(ProductInformation);