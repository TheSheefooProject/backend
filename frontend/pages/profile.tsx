import axios from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react'
import { useState } from 'react'
import Button from '../components/common/Button'
import TextArea from '../components/common/TextArea'
import TextBox from '../components/common/TextBox'

import { FiEdit } from 'react-icons/fi'

const Profile = (props: { localStorage: Storage }) => {
  const { localStorage, ...restProps } = props

  interface IDetails {
    username: string
    email: string
    biography?: string
  }
  const [details, setDetails] = useState<IDetails>()

  useEffect(() => {
    try {
      let lsDetails = JSON.parse(localStorage.userDetails)
      setDetails({
        username: lsDetails.username,
        email: lsDetails.email,
      })
    } catch (e) {}
  }, [localStorage])

  return (
    <main className="static flex min-h-screen w-[100%] min-w-[320px] flex-col justify-between overflow-x-hidden bg-back_3 px-10 pt-12 text-text_1 md:pl-[calc(5vw+10rem)] md:pr-[calc(5vw+5rem)]">
      {/* Profile Container */}
      <div className="mb-4 flex flex-col justify-between rounded-lg border-0 bg-back_2 p-6 font-body md:mb-0 md:flex-row md:border-2">
        <div
          id="userimage"
          className="group relative mr-8 h-full min-h-[12rem] w-full min-w-[12rem] basis-4 cursor-pointer overflow-hidden rounded-md border-2 border-back_4 hover:brightness-75"
        >
          <Image
            src="/images/thispersondoesnotexist.jpg"
            layout="fill"
            objectFit="cover"
          ></Image>
          <FiEdit className="absolute left-2 bottom-2 hidden h-12 w-12 text-white group-hover:inline"></FiEdit>
        </div>
        <div id="userinfo" className="relative">
          <form method="post">
            <ul>
              <li className=" inline-flex w-full flex-col gap-1">
                <label>Username </label>
                <TextBox
                  controlledInput={false}
                  type="text"
                  placeholder={details?.username}
                  name="username"
                ></TextBox>
              </li>
              <li className=" mt-4 inline-flex w-full flex-col gap-1">
                <label>About Me </label>
                <TextArea text="(Current Biography)"></TextArea>
              </li>
              <li>
                <Button
                  noMargin
                  text="Save Changes"
                  type="positive"
                  onClick={() => {}}
                ></Button>
              </li>
            </ul>
          </form>
        </div>
      </div>
      {/* Change User Settings Container */}
      <div className="mb-10 flex flex-col">
        <div className="flex flex-col items-center md:flex-row">
          <Button text="Change E-Mail" type="neutral"></Button>
          <Button text="Change Password" type="neutral"></Button>
        </div>
        <div className="flex flex-col items-center md:flex-row">
          <Button text="Permanently Delete Account" type="negative"></Button>
        </div>
      </div>
    </main>
  )
}

export default Profile
