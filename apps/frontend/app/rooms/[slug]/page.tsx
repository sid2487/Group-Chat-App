"use client"

import { WS_URL } from "@/config";
import MessageClient from "./Messageclient";

export default async function RoomPage({ params }: {params: { slug: string }}){
    const { slug } = params;

    const res = await fetch(`${WS_URL}/message/getmessage/${slug}`, {
        cache: "no-store",
        credentials: "include"
    });

    const data = await res.json();
    
    return (
        <MessageClient slug={slug} initialMessages={data.message} />
    )
}