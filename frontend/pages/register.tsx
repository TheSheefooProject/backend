import type { NextPage } from 'next'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import Button from '../components/common/Button'
import TextBox from '../components/common/TextBox'
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiAlertCircle,
} from 'react-icons/fi'

import {
  general_api,
  login_api,
  check_username_api,
  register_api,
} from '../helpers/api_helper'
import Tooltip from '../components/common/Tooltip'
import Link from 'next/link'
import { emitWarning } from 'process'
import { useRouter } from 'next/router'

const Register: NextPage = () => {
  const [inUsername, setInUsername] = useState('')
  const [inPassword, setInPassword] = useState('')
  const [inEmail, setInEmail] = useState('')
  const [inFullName, setInFullName] = useState('')
  const [userNameTaken, setUserNameTaken] = useState<boolean>(false)
  const [userNameFieldChanged, setuserNameFieldChanged] =
    useState<boolean>(false)

  const router = useRouter()
  // Info Popup Code
  enum TYPE {
    Info,
    Warning,
    Error,
  }

  interface IInfoPopup {
    is_showing: boolean
    type_icon: ReactElement
    type_colour: string
    text: string
  }
  const [infoPopup, setinfoPopup] = useState<IInfoPopup>()

  const flashPopup = (text: string, type: TYPE) => {
    let icon: ReactElement = <FiInfo></FiInfo>
    let colour: string = 'bg-blue-200'
    switch (type) {
      case TYPE.Info:
        icon = <FiInfo size={20}></FiInfo>
        colour = 'bg-blue-200'
        break
      case TYPE.Warning:
        icon = <FiAlertTriangle size={20}></FiAlertTriangle>
        colour = 'bg-yellow-200'
        break
      case TYPE.Error:
        icon = <FiAlertCircle size={20}></FiAlertCircle>
        colour = 'bg-red-200'
        break
      default:
        break
    }
    setinfoPopup({
      is_showing: true,
      text: text,
      type_icon: icon,
      type_colour: colour,
    })
    setTimeout(() => {
      setinfoPopup({
        is_showing: false,
        text: text,
        type_icon: icon,
        type_colour: colour,
      })
    }, 5000)
  }

  const handleRegisterEvent = async (e: any) => {
    // Clientside userNameTaken check
    if (!userNameTaken) {
      if (
        inUsername.length >= 3 &&
        inEmail.length >= 3 &&
        inPassword.length >= 3 &&
        inFullName.length >= 3
      ) {
        const statusObj = await register_api(
          inUsername,
          inEmail,
          inPassword,
          inFullName
        )
        console.log(statusObj)
        if (statusObj.data.status == 'success') {
          router.push('/login')
        }
      } else {
        flashPopup(
          'All fields must be at least 3 characters long.',
          TYPE.Warning
        )
      }
    } else {
      flashPopup('Username is taken. Please pick another.', TYPE.Info)
    }
  }
  const handleKeyUp = (e: any) => {
    if (e.key == 'Enter') {
      handleRegisterEvent(e)
    }
  }
  return (
    <main className="static flex min-h-screen w-[100%] flex-col items-center justify-center overflow-x-hidden bg-back_3 px-10 pt-0 text-text_1  md:min-w-[320px] md:px-[25vw]">
      {/* Profile Container */}
      <div className="flex min-w-max flex-col items-center border-2 border-gray-200 bg-gray-300 p-2 font-body drop-shadow-lg dark:border-gray-500 dark:bg-gray-600 md:flex-row">
        <div id="loginlogo" className="m-3 h-48 w-48 drop-shadow-xl">
          <Image src="/logo.svg" width={200} height={200}></Image>
        </div>
        <div className="relative">
          {/* Info Popup */}
          <div
            className={
              `${
                infoPopup?.is_showing
                  ? '-translate-y-16 rounded-t-sm'
                  : 'translate-y-1'
              }` +
              ' ' +
              `${infoPopup?.type_colour}` +
              ' absolute -top-0 left-0 block h-20 w-full rounded-t-sm text-black transition-transform '
            }
          >
            <div className=" relative flex w-full flex-row justify-center gap-1 p-2">
              <span
                className={
                  `${infoPopup?.type_colour}` +
                  ' ' +
                  `${
                    infoPopup?.is_showing
                      ? ' -translate-x-[0px] -translate-y-[0px] '
                      : ' -translate-x-[15px] translate-y-[15px] '
                  }` +
                  ' absolute -top-[15px] -right-[15px] inline-flex h-10 w-10 content-center items-center justify-center rounded-full border-4 transition-transform dark:border-back_3'
                }
              >
                {infoPopup?.type_icon}
              </span>
              <span className="text-md font-bod6 inline-block px-4">
                {infoPopup?.text}
              </span>
            </div>
          </div>
          <div className="self-center rounded border-0 bg-back_1 p-6 drop-shadow-xl">
            <h1 className="mb-6 text-center font-heading text-4xl">Register</h1>
            <ul className="flex flex-col gap-3">
              <li className="flex flex-col gap-1">
                <TextBox
                  placeholder="E-Mail Address"
                  required
                  type="text"
                  name="email"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={(e: any) => {
                    setInEmail(e.target.value)
                  }}
                  controlledInput={false}
                ></TextBox>
              </li>
              <li className="flex flex-col gap-1">
                <TextBox
                  placeholder="Full Name"
                  required
                  type="text"
                  name="fullName"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={(e: any) => {
                    setInFullName(e.target.value)
                  }}
                  controlledInput={false}
                ></TextBox>
              </li>
              <li className=" relative flex flex-col gap-1">
                <TextBox
                  placeholder="Username"
                  required
                  type="text"
                  name="username"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={async (e: any) => {
                    e.preventDefault()
                    setuserNameFieldChanged(true)
                    setInUsername(e.target.value)
                    setUserNameTaken(await check_username_api(e.target.value))
                  }}
                  controlledInput={false}
                ></TextBox>
                <div
                  className={
                    `${userNameFieldChanged ? 'visible' : 'hidden'}` +
                    ' absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2'
                  }
                >
                  <FiCheckCircle
                    size={20}
                    className={
                      `${userNameTaken ? 'opacity-0' : ' opacity-100'}` +
                      ' absolute text-green-400 transition-opacity'
                    }
                  ></FiCheckCircle>
                  <FiXCircle
                    size={20}
                    className={
                      `${userNameTaken ? 'opacity-100 ' : 'opacity-0'}` +
                      ' absolute text-red-400 transition-opacity'
                    }
                  ></FiXCircle>
                </div>
              </li>
              <li className="flex flex-col gap-1">
                <TextBox
                  placeholder="Password"
                  required
                  type="password"
                  name="password"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={(e: any) => {
                    setInPassword(e.target.value)
                  }}
                  controlledInput={false}
                ></TextBox>
              </li>
              <li className="flex justify-between gap-1 text-blue-500 underline">
                <Link href="/login">Log In</Link>
              </li>
              <li className="mt-2 flex flex-col gap-1">
                <Button
                  noMargin
                  text="Register"
                  type="positive"
                  className=" md:mb-0"
                  onClick={async (e: any) => {
                    handleRegisterEvent(e)
                  }}
                ></Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register
