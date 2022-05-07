import type { NextPage } from 'next'
import Image from 'next/image'
import { ReactElement, SetStateAction, useState } from 'react'
import Button from '../components/common/Button'
import TextBox from '../components/common/TextBox'
import { useRouter } from 'next/router'
import axios from 'axios'

import { get_user_details_api, login_api } from '../helpers/api_helper'
import Link from 'next/link'
import { FiInfo, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi'

const Login = (props: { localStorage: Storage }) => {
  const { localStorage = null, ...restProps } = props
  const router = useRouter()

  const [inEmail, setInEmail] = useState('')
  const [inPassword, setInPassword] = useState('')

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

  const handleKeyUp = (e: any) => {
    if (e.key == 'Enter') {
      handleLogin(e)
    }
  }
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    //TODO this function should set the access and refresh tokens
    // UI update needs to be done so that if it fails then update the ui to have errors
    //Also code to get the user input instead of hard coded values is needed
    let inputValues = []
    if (inEmail == '' && inPassword == '') {
      // Default values if fields are left empty (DEBUGGING ONLY)
      inputValues = ['jeesonjohnson100@gmail.com', 'AASDADASDasdad12313']
    } else {
      inputValues = [inEmail, inPassword]
    }

    // email format validation check
    if (inputValues[0].includes('@')) {
      const statusObj = await login_api(inputValues[0], inputValues[1])
      const userDetails = await get_user_details_api(
        localStorage?.refresh_token
      )

      if (statusObj == 'success') {
        if (localStorage) {
          localStorage.userDetails = JSON.stringify({
            user_id: userDetails.userData._id,
            username: userDetails.userData.username,
            email: inEmail,
          })
        }
        router.push('/')
      } else {
        flashPopup("Your details didn't match an account", TYPE.Error)
      }
    } else {
      flashPopup('Please enter a valid e-mail address', TYPE.Warning)
    }
  }
  return (
    <main className="static flex min-h-screen w-[100%] flex-col items-center justify-center overflow-x-hidden bg-back_3 px-10 pt-0 text-text_1 md:px-[25vw]">
      {/* Profile Container */}
      <div className="flex min-w-max flex-col items-center border-2 border-gray-200 bg-gray-300 p-2 font-body drop-shadow-lg dark:border-gray-500 dark:bg-gray-600 md:flex-row">
        <div id="loginlogo" className="m-3 h-48 w-48 drop-shadow-xl">
          <Image src="/logo.svg" width={200} height={200}></Image>
        </div>
        <div className="relative drop-shadow-xl">
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
              ' absolute -top-0 left-0 block h-20 w-full rounded-t-sm text-black  transition-transform'
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
            <h1 className="mb-6 text-center font-heading text-4xl">Login</h1>

            <ul className="flex flex-col gap-3">
              <li className="flex flex-col gap-1">
                <TextBox
                  placeholder="E-Mail Address"
                  required
                  type="text"
                  name="email"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={(e: {
                    target: { value: SetStateAction<string> }
                  }) => {
                    setInEmail(e.target.value)
                  }}
                  controlledInput={false}
                ></TextBox>
              </li>
              <li className="flex flex-col gap-1">
                <TextBox
                  placeholder="Password"
                  required
                  type="password"
                  name="password"
                  onKeyUp={(e: any) => handleKeyUp(e)}
                  onChange={(e: {
                    target: { value: SetStateAction<string> }
                  }) => {
                    setInPassword(e.target.value)
                  }}
                  controlledInput={false}
                ></TextBox>
              </li>
              <li className="flex justify-between gap-1 text-blue-500 underline">
                <Link href="">Forgot Password </Link>
                <Link href="/register">Register</Link>
              </li>
              <li className="mt-2 flex flex-col gap-1">
                <Button
                  noMargin
                  text="Login"
                  type="positive"
                  className=" md:mb-0"
                  onClick={async (e: any) => handleLogin(e)}
                ></Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login
