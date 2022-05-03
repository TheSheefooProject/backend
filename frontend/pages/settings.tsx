import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../components/common/Button'
import Switch from '../components/common/Switch'
import { ISettings } from './_app'
let body: HTMLBodyElement | null = null
let localStorage: Storage

const SettingsPage = (props: {
  is_dark: boolean
  setDark: Function
  settings: ISettings
  saveSettings: Function
}) => {
  // Default prop values
  const {
    is_dark = false,
    setDark = null,
    settings = null,
    saveSettings = null,
    ...restProps
  } = props

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
        className="container mx-auto flex flex-col text-text_1"
      >
        <h2 className=" border-b-[1px] border-back_2 pb-2 text-left font-heading text-2xl  text-text_2">
          Appearance
        </h2>

        <br />
        {/* Font Size Slider */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Text size</h2>
          <input
            type="range"
            min="1"
            max="100"
            defaultValue="50"
            className="slider"
            id="myRange"
          ></input>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Dark Theme Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Dark theme</h2>
          <Switch
            name="setting_theme"
            onClick={() => props.setDark(!is_dark)}
            initialState={is_dark}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Reduced Motion Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Reduced motion</h2>
          <Switch
            name="setting_motion"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('reduced_motion', e.target.checked)
            }
            initialState={settings?.reduced_motion}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Disable autoplay toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Disable video/GIF autoplay</h2>
          <Switch
            name="setting_autoplay"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('disable_autoplay', e.target.checked)
            }
            initialState={settings?.disable_autoplay}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Disable Sound toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Disable sounds</h2>
          <Switch
            name="setting_sound"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('disable_sounds', e.target.checked)
            }
            initialState={settings?.disable_sounds}
          ></Switch>
        </div>

        <h2 className=" mt-10 border-b-[1px] border-back_2 pb-2 text-left font-heading text-2xl text-text_2">
          Privacy
        </h2>
        <br />

        {/* Reduced Motion Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Profile visibility</h2>
          <Switch
            name="setting_visibility"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('profile_private', e.target.checked)
            }
            initialState={settings?.profile_private}
          ></Switch>
        </div>
        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Reduced Motion Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Receive direct messages from</h2>
          <Switch
            name="setting_dms"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('dms_from_strangers', e.target.checked)
            }
            initialState={settings?.dms_from_strangers}
          ></Switch>
        </div>
        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-back_4 opacity-20 "></span>
        {/* Reduced Motion Toggle */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Disable push notifications</h2>
          <Switch
            name="setting_notifications"
            onClick={(e: { target: { checked: boolean } }) =>
              props.saveSettings('disable_notifications', e.target.checked)
            }
            initialState={settings?.disable_notifications}
          ></Switch>
        </div>

        {/* Divider */}
        <span className="relative bottom-0 my-4 h-[1px] w-auto bg-accent_1 opacity-40 "></span>
        {/* Delete Account Button */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl ">Restore default settings</h2>
          <Button
            text="DEFAULTS"
            type="negative"
            onClick={() => alert('☠️ Default Settings Restored ☠️')}
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
