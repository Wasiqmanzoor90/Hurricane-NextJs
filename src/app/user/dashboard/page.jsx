"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isAuthorised from "../../../../utils/isAuthorised";
import LoadingPage from "@/component/loading/page";


function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const name = typeof window !== "undefined" ? localStorage.getItem("name") || "User" : "User";

  useEffect(() => {
    (async () => {
      const verify = await isAuthorised();
      if (!verify) {
        router.push("/");
      } else {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadingPage/>;
  }

  return (
    <div>
      ✅ You are authorized! This is your protected content.
      <h1>Welcome, {name}!</h1>
    </div>
  );
}

export default Page;
