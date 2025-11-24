
import { BACKEND_URL } from "@/config";
import MessageClient from "./Messageclient";
import { cookies } from "next/headers";

export default async function RoomPage({ params }: {params: { slug: string }}){
    const { slug } = await params;

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const res = await fetch(`${BACKEND_URL}/message/getmessage/${slug}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Cookie: `token=${token}`
        }
    });
    
    const data = await res.json();
    console.log("data from api",data);
    console.log("messages",data.messages);
    
    return (
        <MessageClient slug={slug} initialMessages={data.messages ?? []} />
    )
}