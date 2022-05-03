import '../styles/globals.css'
import '../styles/variables.css'

import type { AppProps } from 'next/app'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/common/Sidebar'
import Head from 'next/head'

import Button from '../components/common/Button'
import { useRouter } from 'next/router'
import { get_user_details_api } from '../helpers/api_helper'

let body: HTMLBodyElement | null = null
let localStorage: Storage

export type ISettings = {
  text_size: number
  dark: boolean
  reduced_motion: boolean
  disable_autoplay: boolean
  disable_sounds: boolean
  profile_private: boolean
  dms_from_strangers: boolean
  disable_notifications: boolean
}
const defaultSettings = {
  text_size: 5,
  dark: false,
  reduced_motion: false,
  disable_autoplay: false,
  disable_sounds: false,
  profile_private: false,
  dms_from_strangers: false,
  disable_notifications: false,
}

function MyApp({ Component, pageProps, router }: AppProps) {
  const [is_dark, setIsDark] = useState<boolean>()
  const [settings, setSettings] = useState<ISettings>()
  const saveSettings = (key: string, val: number | boolean) => {
    if (localStorage !== undefined) {
      switch (key) {
        case 'text_size':
          break
        case 'dark':
          break
        case 'reduced_motion':
          break
        case 'disable_autoplay':
          break
        case 'disable_sounds':
          break
        case 'profile_private':
          break
        case 'dms_from_strangers':
          break
        case 'disable_notifications':
          break

        default:
          break
      }
      let tempCachedSettings = JSON.parse(localStorage.settings)
      tempCachedSettings[key] = val
      localStorage.settings = JSON.stringify(tempCachedSettings)
      // localStorage.settings = JSON.stringify({
      //   text_size: text_size,
      //   dark: dark,
      //   reduced_motion: reduced_motion,
      //   disable_autoplay: disable_autoplay,
      //   disable_sounds: disable_sounds,
      //   profile_private: profile_private,
      //   dms_from_strangers: dms_from_strangers,
      //   disable_notifications: disable_notifications,
      // })
    }
  }
  // Light/Dark theme switching function
  const setDark = (val: boolean) => {
    if (body != null) {
      // Set Dark
      if (val == true) {
        body.classList.add('theme-dark')
        body.classList.remove('theme-light')
        setIsDark(true)
        localStorage.theme = 'dark'
      }

      //Set Light
      if (val == false) {
        body.classList.add('theme-light')
        body.classList.remove('theme-dark')
        setIsDark(false)
        localStorage.theme = 'light'
      }
    }
  }

  // Is called on rerenders, but not state changes
  useEffect(() => {
    body = document.querySelector('body')
    localStorage = window.localStorage

    // User Logged in check
    const fetchUserDetails = async () => {
      const is_logged_in = localStorage.userDetails ? true : false
      if (is_logged_in) {
        const userDetails = await get_user_details_api(
          localStorage.refresh_token
        )
        console.log(userDetails.status)
      } else {
        if (router.asPath != '/register') router.push('/login')
      }
    }
    fetchUserDetails().catch(console.error)

    if (localStorage.settings !== undefined) {
      setSettings(JSON.parse(localStorage.settings))
    } else {
      localStorage.settings = JSON.stringify(defaultSettings)
    }
    // Initially set theme to light
    if (body != null) {
      body.classList.add('theme-light')
    }
    // If theme saved in LocalStorage is dark, swap client theme
    if (
      body != null &&
      (localStorage.theme === 'dark' || !('theme' in localStorage))
    ) {
      setDark(true)
    }
  }, [])
  return (
    <div className="flex flex-row-reverse bg-back_1 text-text_1">
      <Component
        localStorage={localStorage}
        is_dark={is_dark}
        setDark={setDark}
        settings={settings}
        saveSettings={saveSettings}
        {...pageProps}
      />
      {!(router.pathname === '/register' || router.pathname === '/login') && (
        <Sidebar localStorage={localStorage}></Sidebar>
      )}
    </div>
  )
}

export default MyApp
