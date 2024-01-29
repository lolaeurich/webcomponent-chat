import axios from "axios"
import { useId } from "react"
import { useState, useEffect } from "react"

function Chat() {
    
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])

    const handleSend = async () => {
        const msg = {
            id: newMessage,
            role: 'user',
            assistantId: null,
            threadId: null,
            content: [
                {
                    type: "text",
                    text: {
                        value: newMessage
                    }
                }
            ]
        }

        setMessages([...messages, msg])


        const { data } = await axios.post('https://devell-ai-bot.onrender.com/messages', {
            message: newMessage
        })

        // if (!response.status !== )
        
        setMessages([...messages, data.result])
        setNewMessage('')
    }

    useEffect(() => {
        console.log(messages)
      }, [messages])


    return (
        <div>
            <div>
                {Array.isArray(messages) ? 
                    messages.map(msg => (<div key={msg.id}>{msg?.content[0]?.text?.value}</div>))
                : null
                }

            </div>
            <div>
                <input value={newMessage} type="text" onChange={(e) => setNewMessage(e.target.value)}/>
                <button onClick={handleSend}>enviar</button>
            </div>
        </div>
    )
}

export default Chat