import React, { useEffect, useRef, useState } from "react";


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3000');

        ws.current.onopen = () => console.log('Connected to WebSocket Server');

        ws.current.onmessage = (event: MessageEvent) => {
            setMessages(prev => [...prev, event.data]);
        };

        ws.current.onclose = () => console.log('Disconnected from WebSocket server');

        return () => {
            ws.current?.close();
        }
    }, []);

    const sendMessage = () => {
        if(input && ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(input);
            setInput('');
        }
    }

    return(
        <div>
            <h1>Chat</h1>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}/>
            <button onClick={sendMessage}>Send</button>

            <ul>
                {messages.map((msg, i) => (
                    <div>
                        <p>{}</p>
                        <li key={i}>{msg}</li>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default Chat;