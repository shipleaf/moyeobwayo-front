"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function MeetPageRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const storedMeetingHash = sessionStorage.getItem("have_to_route");

    if (storedMeetingHash) {
      sessionStorage.removeItem("have_to_route");
      router.push(`/meeting/${storedMeetingHash}`);
    }
  }, [router]);

  return <div className="hidden"></div>;
}
