"use client"

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";

type transactionType = {
    id: string,
    text:string,
    amount:number,
    created_at:string
}

export default function Home() {
    const [transactions, setTransactions]=useState<transactionType[]>([])

    const getTransactions = async () =>{

        try {
            const res = await api.get<transactionType[]>("transactions/")
            setTransactions(res.data)
            toast.success('Successfully')
        } catch (err) {
            console.error("failde to fetch", err);
            toast.error('Failed')
        }
    }

    useEffect(()=>{
        getTransactions()
    },[])
  return (
<div className="btn btn-accent">test</div>
  );
}
