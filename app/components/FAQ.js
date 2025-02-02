import React from 'react'

const FAQ = ({ques, ans}) => {
  return (
    <div className='bg-zinc-800/50 shadow-2xl mt-8 h-fit w-[85%] mx-auto py-2 rounded-md px-3 py-1 text-white font-sans font-normal text-lg'>
      <p className='font-bold' >{ques}</p>
      <p>{ans}</p>
    </div>
  )
}

export default FAQ
