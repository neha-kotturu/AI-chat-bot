'use client'
import { useState } from 'react'
import { Box, Stack, TextField, Button, useMediaQuery } from '@mui/material'
import Head from 'next/head'
import SendIcon from '@mui/icons-material/Send'

const predefinedQuestions = [
    "Question 1",
    "Question 2",
    "Question 3",
];

export default function Home() {
    //initializing screen dimensions used for styling
    const isSmallScreen = useMediaQuery('(max-width:800px)')

    //starting bot message
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I am the Headstarter support assistant. How can I help you today?",
            questions: predefinedQuestions,
        },
    ])

    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async (msg) => {
        const userMessage = msg || message.trim();
        if (!userMessage) return //empty msg

        //clear the message input field if sending custom message
        if (!msg) setMessage('')

        //send the user's message
        setMessages((messages) => [
            ...messages,
            { role: 'user', content: userMessage },
            { role: 'assistant', content: '' }
        ])
        setLoading(true)

        //get the ai's response
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([...messages, { role: 'user', content: userMessage }]),
        })

        //stream the ai's response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let result = ''

        const processText = async ({ done, value }) => {
            if (done) {
                setMessages((messages) => {
                    let lastMessage = messages[messages.length - 1]
                    let otherMessages = messages.slice(0, messages.length - 1)
                    return [...otherMessages, { ...lastMessage, content: result }]
                })
                setLoading(false)
                return
            }
            const text = decoder.decode(value, { stream: true })
            result += text
            setMessages((messages) => {
                let lastMessage = messages[messages.length - 1]
                let otherMessages = messages.slice(0, messages.length - 1)
                return [...otherMessages, { ...lastMessage, content: result }]
            })
            reader.read().then(processText)
        }
        reader.read().then(processText)
    }

    //clear chat history, reset all messages
    const clearMessages = () => {
        setMessages([
            {
                role: "assistant",
                content: "Hi! I am the Headstarter support assistant. How can I help you today?",
                questions: predefinedQuestions,
            },
        ])
    }

    //export the chat into a textfile
    const exportChat = () => {
        //format the messages to be styled better
        const formattedMessages = messages.map((message) => {
            return `${message.role === 'assistant' ? 'Bot:' : 'You:'} ${message.content}`
        }).join('\n\n')

        const blob = new Blob([formattedMessages], { type: 'text/plain' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'headstarter-chat-history.txt'
        link.click()
    }

    //styling
    const backgroundStyling = {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #aed2f2, #f7f9fc, #aed2f2)',
        padding: '10px'
    }

    const chatBox = {
        width: isSmallScreen ? '90rem' : '40rem',
        height: '90vh',
        border: '1px solid #ddd',
        borderRadius: '12px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        fontFamily: 'Roboto, sans-serif',
    }

    const heading = {
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#3487d1',
    }

    const chatMsgs = {
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingRight: '10px',
    }

    const chatMsg = (role) => ({
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '20px',
        fontSize: '15px',
        lineHeight: '1.5',
        backgroundColor: role === 'assistant' ? '#f5f2f2' : '#3487d1',
        color: role === 'assistant' ? '#363535' : '#fff',
        alignSelf: role === 'assistant' ? 'flex-start' : 'flex-end',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    })

    const typingIndicator = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '20px',
        backgroundColor: '#f1f1f1',
        color: '#3487d1',
        alignSelf: 'flex-start',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }

    const typingDots = {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#3487d1',
        margin: '0 2px',
    }

    const inputMsg = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '10px',
    }

    const inputStyle = {
        flexGrow: 1,
        borderRadius: '24px',
        backgroundColor: '#f1f3f4',
        //removing input field border
        '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
            '& fieldset': {
                border: 'none',
            },
            '&:hover fieldset': {
                border: 'none',
            },
            '&.Mui-focused fieldset': {
                border: 'none',
            },
        },
    }

    const buttons = {
        backgroundColor: '#3487d1',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '24px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#1e5c94',
        },
    }

    const questionOptions = {
        margin: '5px 0',
        padding: '8px 12px',
        borderRadius: '24px',
        backgroundColor: '#f0f0f0',
        color: '#3487d1',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        textAlign: 'left',
        width: '100%',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
    }

    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,1000,3000,4000,5000,7000,9001,1001,3001,4001,5001,7001,900&display=swap" rel="stylesheet" />
            </Head>

            <Box sx={backgroundStyling}>
                <Box sx={chatBox}>
                    <div style={heading}>Chat with Headstarter!</div>
                    <Stack sx={chatMsgs}>
                        {messages.map((message, index) => (
                            <Box
                                key={index}
                                sx={chatMsg(message.role)}
                            >
                                {message.content}
                                {message.questions && message.role === 'assistant' && (
                                    <Stack spacing={1}>
                                        {message.questions.map((question, idx) => (
                                            <Button
                                                key={idx}
                                                sx={questionOptions}
                                                onClick={() => sendMessage(question)}
                                            >
                                                {question}
                                            </Button>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        ))}
                        {loading && (
                            <Box sx={typingIndicator}>
                                <div style={typingDots}></div>
                                <div style={typingDots}></div>
                                <div style={typingDots}></div>
                            </Box>
                        )}
                    </Stack>

                    <Stack direction="row" sx={inputMsg}>
                        <TextField
                            label="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={inputStyle}
                        />
                        <Button
                            sx={buttons}
                            variant="contained"
                            onClick={() => sendMessage()}
                        >
                            <SendIcon />
                        </Button>
                    </Stack>

                    <Button
                        sx={{
                            ...buttons,
                            marginTop: '15px',
                        }}
                        onClick={clearMessages}
                    >
                        Clear chat
                    </Button>

                    <Button 
                        sx={{
                            color: '#3487d1',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '24px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#f0f0f2',
                            },
                            marginTop: '10px',
                        }}
                        onClick={exportChat}
                    >
                        Export Chat
                    </Button>
                </Box>
            </Box>
        </>
    )
}

