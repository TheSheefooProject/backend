import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../components/common/Button'
import Switch from '../components/common/Switch'
import { ISettings } from './_app'
import { useRouter } from 'next/router'

let body: HTMLBodyElement | null = null
let localStorage: Storage

const SettingsPage = (props: {
  is_dark: boolean
  reduced_motion: boolean
  setDark: Function
  settings: ISettings
  saveSettings: Function
  resetSettings: Function
}) => {
  // Default prop values
  const {
    is_dark = false,
    reduced_motion = false,
    setDark = null,
    settings = null,
    saveSettings = null,
    resetSettings = null,
    ...restProps
  } = props

  const router = useRouter()
  const [settingsState, setSettingsState] = useState(settings)
  useEffect(() => {
    setSettingsState(settings)
  }, [settings])

  useEffect(() => {
    router.replace(router.asPath)
  }, [])

  return (
    <main className="md:[5vw] static min-h-screen w-[100%] min-w-[320px] overflow-x-hidden bg-back_3 px-10 pt-12 md:px-[calc(20vw+5rem)]">
      <Head>
        <title>Sheefoo | Dev Page</title>
      </Head>

      <h1 className=" pb-2 text-right font-heading text-4xl text-accent_2">
        Settings
      </h1>
      <br />
      {/* Settings Container */}
      <form
        id="settings_container"
        className="container mx-auto flex flex-col justify-between text-text_1"
      >
        <h2 className="  pb-2 text-left font-heading text-2xl  text-text_2">
          Appearance
        </h2>
        {/* Divider */}
        <span className="relative bottom-0 mb-4 mt-1 h-[1px] w-auto bg-back_2 opacity-100 "></span>
        <br />
        {/* Dark Theme Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Dark theme</h2>
          <Switch
            name="setting_theme"
            onClick={(e: { target: { checked: any } }) =>
              props.saveSettings('dark', e.target.checked)
            }
            initialState={settingsState?.dark}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Disable Sound toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Disable sounds</h2>
          <Switch
            name="setting_sound"
            onClick={(e: { target: { checked: boolean } }) => {
              props.saveSettings('disable_sounds', e.target.checked)
            }}
            check_sound="/sounds/ping.mp3"
            uncheck_sound="/sounds/ping.mp3"
            initialState={settingsState?.disable_sounds}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Reduced Motion Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Reduced motion</h2>
          {reduced_motion ? (
            <div className="group visible relative z-10 border-2 border-[#2b4049] bg-[#8C9EDB] px-2 py-1 font-semibold text-black ">
              Motion is turned OFF
              <span className="absolute top-20 -left-24 z-10 w-40 rounded-sm border-2 border-accent_1 bg-back_1 px-2 py-1 text-text_1 opacity-0 group-hover:opacity-100 sm:-top-0 sm:-left-44">
                Change motion settings in your OS' accessibility options
              </span>
            </div>
          ) : (
            <div className="group visible relative z-10 animate-bounce border-2 border-[#2b4049] bg-[#8C9EDB] px-2 py-1 font-semibold text-black ">
              Motion is turned ON
              <span className="absolute top-20 -left-24 z-10 w-40 rounded-sm border-2 border-accent_1 bg-back_1 px-2 py-1 text-text_1 opacity-0 transition-opacity group-hover:opacity-100 sm:-top-0 sm:-left-44">
                Change motion settings in your OS' accessibility options
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-accent_1 opacity-40 "></span>
        {/* Delete Account Button */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Restore default settings</h2>
          <Button
            text="DEFAULTS"
            type="negative"
            onClick={() => {
              if (resetSettings != null) {
                resetSettings()
              }
            }}
            noMargin
            fixedWidth
          ></Button>
        </div>
        <br />
        <br />
      </form>
    </main>
  )
}

export default SettingsPage
