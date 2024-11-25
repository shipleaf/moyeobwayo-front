import Image from 'next/image'
import React from 'react'

interface AvatarSmallInterface{
  src: string;
}
export default function AvatarSmall({src}:AvatarSmallInterface) {
  return (
    <div className="flex flex-col items-center ">
      {src? (
        <Image
          src= {src}
          alt='sample이미지'
          width={20}
          height={20}
          className="rounded-full object-cover w-5 h-5 overflow-hidden"
        />
      ):(
        <div className='w-5 h-5 rounded-full bg-[#ddd] text-white flex justify-center items-center'>
          <p>?</p>
        </div>
      )}
    </div>
  )
}

