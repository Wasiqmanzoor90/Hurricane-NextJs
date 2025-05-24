// import { useRouter } from 'next/router'
"use client";
import { useRouter}  from "next/navigation";
import { useEffect } from "react";


function isAuthorised() {
    const router = useRouter();
    const verifyToken = async () => {

        try {

            const url = "/api/user/token";
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",

            });
            const data = await res.json();
            sessionStorage.setItem("user", JSON.stringify(data.verify));
            if (res.ok) {
                return true;

            }
            else {
                false;
            }

        } catch (error) {
            console.error(error);
            return false;
        }
    };
    useEffect(()=>{
        (async()=>{
            let verify = await verifyToken();
            if(!verify) {
                router.push("/");
            }   
        })();
    },[]);
}

export default isAuthorised;