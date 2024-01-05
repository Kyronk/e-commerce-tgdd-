import React, {memo, useRef, useEffect, useState} from 'react';
import logo from "../../assets/logo_digi.png";
import {Button} from ".."

import { voteOptions } from '../../utils/contants';
import icons from '../../utils/icons';


const { IoIosStar } = icons;

const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
    // console.log(handleSubmitVoteOption)
    const modalRef = useRef();
    const [chosenScore, setChosenScore] = useState(null);
    const [comment, setComment] = useState("");
    const [score, setScore] = useState(null);

    useEffect(() => {
        modalRef.current.scrollIntoView({block: "center", behavior: "smooth"});
    })
    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            ref={modalRef} 
            className='bg-white w-[700px] h-[500px] opacity-1 p-4 flex-col gap-4 flex items-center justify-center '>
            <img src={logo} alt="logo" className='w-[300px] my-8 object-contain' />
            <h2 className='text-center text-medium text-lg'>{`Voting product ${nameProduct}`}</h2>
            <textarea 
                placeholder='Type something'
                className="font-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm" 
                value={comment}
                onChange={e => setComment(e.target.value)}
                ></textarea>
            <div className='w-full flex flex-col gap-4'>
                <p>How do you like this product?</p>
                <div className='flex justify-center gap-4 items-center'>
                    {voteOptions.map(el => (
                            <div 
                                className='w-[100px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-4 h-[100px] flex
                                items-center justify-center flex-col gap-2'
                                key={el.id}
                                onClick={() => {
                                    setChosenScore(el.id);
                                    setScore(el.id)
                                }}
                            >
                                {(Number(chosenScore) && chosenScore >= el.id) ? <IoIosStar color="orange" /> : <IoIosStar color="gray" />}
                                
                                <span>{el.text}</span>
                            </div>
                        ))}
                </div>
            </div>
            <Button
                handleOnClick={() => handleSubmitVoteOption({comment, score})} 
                fw>Submit</Button>
        </div>
    )
}

export default memo(VoteOption);