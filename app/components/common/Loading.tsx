import React from 'react'

export default function Loading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'>
      <div className='flex flex-col items-center'>
        <div className="loader"></div>
        <p className="mt-4 text-lg">로딩 중입니다...</p>
      </div>
    </div>
  )
}