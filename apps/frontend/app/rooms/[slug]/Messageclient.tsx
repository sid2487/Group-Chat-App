"use client"

import { useState } from "react";

interface MessageClient {
    slug: string,
    initialMessages: any[];
}

export default function MessageClient({ slug, initialMessages }: MessageClient){

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState(initialMessages);




    return (
        <div>
            hi from message client
        </div>
    )
}