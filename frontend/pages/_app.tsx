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
  dark: true,
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
  const [reduced_motion, setReduced_motion] = useState<boolean>()

  const resetSettings = () => {
    localStorage.settings = JSON.stringify({
      text_size: 5,
      dark: false,
      reduced_motion: false,
      disable_autoplay: false,
      disable_sounds: false,
      profile_private: false,
      dms_from_strangers: false,
      disable_notifications: false,
    })
  }
  const saveSettings = (key: string, val: number | boolean) => {
    if (localStorage !== undefined) {
      switch (key) {
        case 'dark':
          setDark(val)
          break
        case 'disable_sounds':
          break

        default:
          break
      }
      let tempCachedSettings = JSON.parse(localStorage.settings)
      tempCachedSettings[key] = val
      localStorage.settings = JSON.stringify(tempCachedSettings)
    }
  }
  // Light/Dark theme switching function
  const setDark = (val: boolean | number) => {
    if (body != null) {
      // Set Dark
      if (val == true) {
        body.classList.add('theme-dark')
        body.classList.remove('theme-light')
        setIsDark(true)
        JSON.parse(localStorage.settings).dark = JSON.stringify(true)
      }

      //Set Light
      if (val == false) {
        body.classList.add('theme-light')
        body.classList.remove('theme-dark')
        setIsDark(false)
        JSON.parse(localStorage.settings).dark = JSON.stringify(false)
      }
    }
  }

  // Is called on rerenders, but not state changes
  useEffect(() => {
    body = document.querySelector('body')
    localStorage = window.localStorage

    // If user has reduced motion switched on in OS settings =>
    if (window && window.matchMedia) {
      let mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      console.log(mediaQuery)

      if (mediaQuery.matches == true) {
        setReduced_motion(true)
      } else {
        setReduced_motion(false)
      }
      console.log('redmo', reduced_motion)
    }

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
      (JSON.parse(localStorage.settings).dark === true ||
        !('settings' in localStorage))
    ) {
      setDark(true)
    }
  }, [])
  return (
    <div className="flex flex-row-reverse bg-back_1 text-text_1">
      <Component
        localStorage={localStorage}
        is_dark={is_dark}
        reduced_motion={reduced_motion}
        setDark={setDark}
        settings={settings}
        saveSettings={saveSettings}
        resetSettings={resetSettings}
        {...pageProps}
      />
      {!(router.pathname === '/register' || router.pathname === '/login') && (
        <Sidebar localStorage={localStorage}></Sidebar>
      )}
    </div>
  )
}

export default MyApp
