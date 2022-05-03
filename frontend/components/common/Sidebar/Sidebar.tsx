import styles from './sidebar.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FiSettings, FiUser, FiLogOut, FiMessageSquare } from 'react-icons/fi'
import Tooltip from '../Tooltip'
import Button from '../Button'
import { logout_api } from '../../../helpers/api_helper'

const Sidebar = (props: { localStorage: Storage }) => {
  const { localStorage, ...restProps } = props
  const [sidebar_visible, setSidebarVisible] = useState<boolean>()
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    try {
      setUsername(JSON.parse(localStorage.userDetails).username)
    } catch (e) {}
  }, [localStorage])

  return (
    <>
      <div
        className={
          `${sidebar_visible ? 'w-20' : 'w-0'}` +
          ' fixed left-0 top-0 z-50 h-[100vh] drop-shadow-lg md:w-20'
        }
      >
        {/* Dark Overlay */}
        <div
          className={
            `${sidebar_visible ? 'visible' : 'hidden'}` +
            ' fixed top-0 left-0 -z-10 h-[100vh] w-[100vw] bg-[rgba(0,0,0,0.8)]  bg-blend-darken md:hidden'
          }
          onClick={() => setSidebarVisible(false)}
        ></div>
        {/* Hamburger Menu Button */}
        <button
          className={
            `${sidebar_visible ? 'left-20' : 'left-0'}` +
            ' absolute z-50 ml-1 h-12 w-12 text-text_1 md:hidden'
          }
          onClick={() => setSidebarVisible(!sidebar_visible)}
        >
          <GiHamburgerMenu
            size="3em"
            className={
              `${sidebar_visible ? 'fill-accent_2' : 'fill-text_1'}` +
              ' absolute top-0 '
            }
          ></GiHamburgerMenu>
        </button>

        {/* Sidebar */}
        <div
          className={
            `${
              (styles.sidebar, sidebar_visible ? 'flex w-20' : 'hidden w-0')
            }` +
            '   h-[100%] w-20 flex-col items-center bg-back_1 py-2 text-text_1 md:flex md:w-20'
          }
        >
          <Link href="/">
            <a className="has-tooltip relative mt-3 px-3 drop-shadow-lg hover:top-[1px] hover:drop-shadow-none">
              <Image src="/logo.svg" width={64} height={64}></Image>
              <Tooltip text="Home" side="right"></Tooltip>
            </a>
          </Link>
          <Link href="/messages">
            <a className=" has-tooltip relative mt-5 drop-shadow-lg hover:top-[1px] hover:cursor-pointer hover:text-accent_2 hover:drop-shadow-none">
              <FiMessageSquare size="3.5em"></FiMessageSquare>
              <Tooltip text="Messages" side="right"></Tooltip>
            </a>
          </Link>

          {/* Free space */}

          <Link href="/profile">
            <div className="relative mt-auto justify-self-end drop-shadow-lg">
              <div className=" has-tooltip  hover:top-[1px] hover:cursor-pointer hover:text-accent_2 hover:drop-shadow-none ">
                <FiUser size="3.5em"></FiUser>
                <Tooltip text="Profile" side="right"></Tooltip>
              </div>
              <h3 className="absolute -top-6 left-1/2 max-w-[3.5em] -translate-x-1/2 overflow-clip overflow-ellipsis text-center">
                {username}
              </h3>
            </div>
          </Link>
          <Link href="/settings">
            <div className=" has-tooltip relative mt-5 justify-self-end drop-shadow-lg hover:top-[1px] hover:cursor-pointer hover:text-accent_2 hover:drop-shadow-none">
              <FiSettings size="3.5em"></FiSettings>
              <Tooltip text="Settings" side="right"></Tooltip>
            </div>
          </Link>
          <button
            className=" has-tooltip relative mt-5 h-[3.5em] w-[3.5em] justify-self-end bg-transparent drop-shadow-lg hover:top-[1px] hover:cursor-pointer hover:text-accent_2 hover:drop-shadow-none"
            onClick={async (e: any) => {
              e.preventDefault()
              console.log(localStorage)

              const status = await logout_api(
                JSON.parse(localStorage.userDetails).email
              )
              if (status == 'success') {
                localStorage.removeItem('userDetails')
                // TODO REMOVE ACCESS/REFRESH TOKEN? ON LOGOUT
                router.push('/login')
              }
            }}
          >
            <div className=" ">
              <FiLogOut size="3.5em"></FiLogOut>
              <Tooltip text="Log Out" side="right"></Tooltip>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
