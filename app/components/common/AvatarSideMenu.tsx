import Image from 'next/image'
import React from 'react'

interface AvatarSmallInterface{
  src?: string;
}
export default function AvatarSideMenu({src}:AvatarSmallInterface) {
  return (
    <div className="flex flex-col items-center ">
      {src? (
        <Image
          src= {src}
          alt='sample이미지'
          width={64}
          height={64}
          className="rounded-full object-cover w-[64px] h-[64px] overflow-hidden"
        />
      ):(
        <div className='w-[64px] h-[64px] rounded-full bg-[#ddd] text-white flex justify-center items-center'>
          <p>?</p>
        </div>
      )}
    </div>
  )
}

