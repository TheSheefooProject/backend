import { NextPage } from 'next'
import Image from 'next/image'
import React, { useRef } from 'react'
import io from 'socket.io-client'

export interface Props {
  messages: Array<any>
  roomName: string
  loading: boolean
}

type MessageObject = {
  user_name: string
  message: string
  id: string
  type: 'INCOMING' | 'OUTGOING'
}

const DMFragment: NextPage<Props> = (props) => {
  const { messages = [], loading = false, roomName } = props

  return (
    <>
      <p className="sticky top-0 pt-4 text-center font-heading text-xl">
        Now talking to {roomName}
      </p>
      <div id="messages_container" className="flex flex-col p-2 md:p-4">
        {loading ? (
          <Image
            src="/images/spinner.svg"
            width={400}
            height={600}
            quality={100}
          ></Image>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map(function (message: MessageObject, idx) {
              if (message.type == 'INCOMING') {
                return (
                  <p
                    itemType="incoming"
                    className="relative max-w-[50%] self-end "
                    id={message.id + idx}
                  >
                    <div className="w-fit max-w-[100%] overflow-hidden overflow-ellipsis rounded-lg rounded-br-none bg-accent_1 px-4 py-2 text-black">
                      {message.message}
                    </div>
                  </p>
                )
              }
              return (
                <p
                  itemType="outgoing"
                  className="relative max-w-[50%]"
                  id={message.id + idx}
                >
                  <div className="ml-6 w-fit max-w-[100%] overflow-hidden overflow-ellipsis rounded-lg rounded-bl-none bg-back_4 px-4 py-2">
                    {message.message}
                    <span className="absolute left-0 -bottom-5 text-sm text-gray-400">
                      {message.user_name}
                    </span>
                    <span className="absolute left-2 -bottom-0 text-sm text-gray-400">
                      ⮣
                    </span>
                  </div>
                </p>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default DMFragment
