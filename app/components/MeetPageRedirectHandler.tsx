'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
export default function MeetPageRedirectHandler() {
  const storedMeetingHash = sessionStorage.getItem("have_to_route");
  const router = useRouter();

  if (storedMeetingHash) {
    sessionStorage.removeItem("have_to_route");

    router.push(`/meeting/${storedMeetingHash}`)
  }

  return (
    <div className='hidden'></div>
  );
}