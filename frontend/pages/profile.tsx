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
import {
  delete_user,
  get_user_details_api,
  update_user_details,
} from '../helpers/api_helper'
import { useRouter } from 'next/router'

const Profile = (props: { localStorage: Storage }) => {
  const { localStorage, ...restProps } = props
  const router = useRouter()

  interface IDetails {
    username: string
    full_name: string
    email: string
    avatar: string
    biography?: string
  }
  const defaultDetails = {
    username: 'DEFAULT',
    full_name: 'DEFAULT',
    email: 'DEFAULT@DEFAULT.DEFAULT',
    avatar: '/images/default_profile_image.webp',
    biography: 'DEFAULT',
  }
  const [details, setDetails] = useState<IDetails>(defaultDetails)
  const [new_avatar, setNew_avatar] = useState<string>(defaultDetails.avatar)
  const [new_username, setNew_username] = useState<string>(
    defaultDetails.username
  )
  const [new_fullname, setNew_fullname] = useState<string>(
    defaultDetails.full_name
  )
  const [new_email, setNew_email] = useState<string>(defaultDetails.email)
  useEffect(() => {
    getUserDetails()
  }, [details.avatar])

  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    let userDetails = await get_user_details_api()
    setDetails({
      username: userDetails.userData.username,
      full_name: userDetails.userData.full_name,
      email: userDetails.userData.email,
      avatar: userDetails.userData.profile_pic_url,
      biography: userDetails.user_bio,
    })
    setNew_avatar(details.avatar)
  }
  const setNewAvatar = (url: string | null) => {
    if (url == ('' || null || undefined) || url.length <= 4) {
      setNew_avatar(defaultDetails.avatar)
    } else {
      setNew_avatar(url)
    }
  }
  const postUserDetails = async (e: any) => {
    e.preventDefault()
    if (localStorage) {
      localStorage.userDetails = JSON.stringify({
        ...(true && { user_id: (await get_user_details_api()).userData._id }),
        ...(new_username != 'DEFAULT' && { username: new_username }),
        ...(new_email != 'DEFAULT@DEFAULT.DEFAULT' && { email: new_email }),
      })
    }

    e.target.innerText = '🪴Changes Saved🪴'
    setTimeout(() => {
      e.target.innerText = 'Save Changes'
    }, 1000)
    update_user_details(new_username, new_email, new_fullname, new_avatar)
  }
  return (
    <main className="static flex min-h-screen w-[100%] min-w-[320px] flex-col items-center justify-around overflow-x-hidden bg-back_3 px-10 pt-12 text-text_1 md:pl-[calc(1vw+10rem)] md:pr-[calc(1vw+5rem)]">
      <Head>
        <title>Sheefoo Profile</title>
      </Head>
      {/* Profile Container */}
      <div className="lg:mx-1/2 mb-4 flex min-w-[50vw] max-w-[80vw] flex-col items-center justify-between rounded-lg border-0 bg-back_2 p-6 font-body sm:mx-0 md:mb-0 md:min-w-[600px] md:flex-row md:border-2">
        <div
          id="userimage"
          className="group relative h-[8rem] min-h-[8rem] w-[8rem] min-w-[8rem] basis-4 cursor-pointer overflow-hidden rounded-md border-2 border-back_4 hover:brightness-75 md:mr-8"
          onClick={(e) => setNewAvatar(prompt('Enter an image URL'))}
        >
          <Image src={new_avatar} layout="fill" objectFit="cover"></Image>
          <FiEdit className="absolute left-2 bottom-2 hidden h-12 w-12 text-white group-hover:inline"></FiEdit>
        </div>
        <div id="userinfo" className="relative w-full">
          <form method="post">
            <ul>
              <li className=" mb-2 inline-flex w-full flex-col gap-1">
                <label>E-Mail</label>
                <TextBox
                  controlledInput={false}
                  type="text"
                  placeholder={details.email}
                  name="email"
                  onChange={(e: any) => setNew_email(e.target.value)}
                ></TextBox>
                <label>Username </label>
                <TextBox
                  controlledInput={false}
                  type="text"
                  placeholder={details.username}
                  name="username"
                  onChange={(e: any) => setNew_username(e.target.value)}
                ></TextBox>
                <label>Full Name</label>
                <TextBox
                  controlledInput={false}
                  type="text"
                  placeholder={details.full_name}
                  name="full_name"
                  onChange={(e: any) => setNew_fullname(e.target.value)}
                ></TextBox>
              </li>
              <li>
                <Button
                  noMargin
                  text="Save Changes"
                  type="positive"
                  className="mb-2"
                  onClick={(e: any) => {
                    postUserDetails(e)
                  }}
                ></Button>
              </li>
              <div className="h-0.5 w-full bg-accent_2 opacity-50"></div>

              {/* Change User Settings Container */}
              <div className="mb-0 mt-1 flex flex-col">
                <div className="flex flex-col items-center md:flex-row">
                  <Button
                    text="Delete Account"
                    type="negative"
                    onClick={(e: any) => {
                      e.preventDefault()
                      delete_user()
                      localStorage.removeItem('userDetails')
                    }}
                  ></Button>
                </div>
              </div>
            </ul>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Profile
