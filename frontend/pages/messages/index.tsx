import { NextPage } from 'next'
import Image from 'next/image'
import { SetStateAction, useRef } from 'react'
import { useState } from 'react'
import React from 'react'
import { FiPlus, FiSend } from 'react-icons/fi'
import TextBox from '../../components/common/TextBox'
import DMFragment from './DMFragment'
import io from 'socket.io-client'
import axios from 'axios'

type MessageObject = {
  message: string
  id: string
  type: 'INCOMING' | 'OUTGOING'
}
const socketConnection = io('http://localhost:3005', {
  transports: ['websocket'],
})

const DirectMessagesPage: NextPage = (props) => {
  const [activeDMS, setActiveDMS] = useState([
    { roomName: 'Global Chat', roomID: 'global' },
  ])
  const [currentTypedMessage, setCurrentTypedMessage] = useState('')
  const [currentRoomName, setCurrentRoom] = useState('global')
  const [messages, setMessages] = React.useState([
    { message: 'test', id: 'asda', type: 'OUTGOING' },
  ])
  const [loading, setLoading] = React.useState(true)
  const [loadingOldMessages, setLoadingOldMessages] = React.useState(true)
  const [users, setUsers] = React.useState([])
  const messages_div = useRef<any>(null)

  //SORRY I KNOW THIS IS SPAGETTI CODE :,( BUT TIME CONSTRAINTS AND THAT.
  React.useEffect(() => {
    //scroll to bottom of messages div
    setTimeout(() => {
      messages_div.current.scroll(0, messages_div.current.scrollHeight)
    }, 250)
    //
    socketConnection.on('new-message', (data) => {
      console.log('Here is new message', data)
    })

    const user_id = JSON.parse(window.localStorage.userDetails).user_id
    const user_name = JSON.parse(window.localStorage.userDetails).username

    const id = `${user_id}:${Date.now()}`

    axios
      .get(`http://localhost:3005/v1/messages/${currentRoomName}`)
      .then((result) => {
        const messagesFormatted: Array<any> = []
        const messagesArr = result.data.messages
        for (let x = 0; x < messagesArr.length; x++) {
          // console.log(messagesArr[x])
          const type =
            messagesArr[x].user_id == user_id ? 'INCOMING' : 'OUTGOING'
          messagesFormatted.push({ ...messagesArr[x], type })
        }
        setMessages(messagesFormatted)
        setLoadingOldMessages(false)
      })

    socketConnection.emit(
      'join',
      { id, name: user_name, room: currentRoomName, user_id },
      (e: any) => {}
    )
    socketConnection.on('message', (message) => {
      // @ts-ignore: Unreachable code error
      const type = message.id == user_id ? 'INCOMING' : 'OUTGOING'
      setMessages((messages) => [...messages, { ...message, type }])
    })

    socketConnection.on('roomData', ({ users }) => {
      setUsers(users)
    })

    setLoading(false)
    return () => {
      socketConnection.emit('disconnect_user')
      socketConnection.off()
    }
  }, [props, currentRoomName])

  const handleSendMessage = async (e: any) => {
    if (currentTypedMessage != '') {
      if (e.key == 'Enter' || e.key == undefined) {
        const user_id = JSON.parse(window.localStorage.userDetails).user_id
        const user_name = JSON.parse(window.localStorage.userDetails).username
        await axios.post('http://localhost:3005/v1/messages/', {
          chat_room_id: currentRoomName,
          user_id,
          user_name,
          message: currentTypedMessage,
        })
        socketConnection.emit('sendMessage', currentTypedMessage, () => {
          setCurrentTypedMessage('')
          messages_div.current.scroll(0, messages_div.current.scrollHeight)
        })
      }
    }
  }
  return (
    <main className="flex max-h-screen min-h-screen w-[100%] flex-col items-stretch bg-back_2 py-2 pl-2 pr-2 md:pl-24 md:pr-4 md:pt-4">
      {/* Direct Message user bubbles */}
      <div className="relative flex h-16 w-full flex-row items-center justify-end gap-2 py-2">
        {activeDMS.map(({ roomID, roomName }, idx) => (
          <div
            className="flex h-[50px] items-center border-2 border-gray-400 px-2 py-1 text-gray-400 transition-all hover:animate-pulse hover:cursor-pointer hover:rounded-md hover:border-accent_1 hover:text-accent_1"
            onClick={(e) => {
              e.preventDefault()
              setCurrentRoom(roomID)
            }}
          >
            <h3 className="font-semibold">{roomName}</h3>
          </div>
        ))}

        <div
          className="border-2 border-gray-100 transition-all hover:animate-pulse hover:cursor-pointer hover:rounded-md hover:border-accent_1 hover:text-accent_1"
          title="Start new conversation"
        >
          <FiPlus size={46}></FiPlus>
        </div>
      </div>

      {/* Direct Message Embed Fragment */}
      <div
        ref={messages_div}
        className="b-2 mb-12 h-full w-full overflow-y-auto scroll-smooth rounded-md bg-back_3 "
      >
        <DMFragment
          messages={messages}
          loading={loading || loadingOldMessages}
          roomName={currentRoomName}
        ></DMFragment>
        <div className="fixed bottom-0 left-0 flex w-full items-center border-t-2 border-back_1 bg-back_3 p-2">
          <TextBox
            name="msgInput"
            type="text"
            className="ml-auto w-3/4"
            onChange={(e: { target: { value: SetStateAction<string> } }) => {
              setCurrentTypedMessage(e.target.value)
            }}
            text={currentTypedMessage}
            onKeyUp={(e: any) => handleSendMessage(e)}
            controlledInput={true}
          ></TextBox>
          <FiSend
            title="Send Message"
            className=" mr-auto ml-4 text-accent_2 hover:cursor-pointer"
            size={32}
            onClick={(e: any) => handleSendMessage(e)}
          ></FiSend>
        </div>
      </div>
    </main>
  )
}

export default DirectMessagesPage
