import { MouseEventHandler, useEffect } from 'react'
import styles from './switch.module.scss'
import { useState } from 'react'
import useSound from 'use-sound'

const Switch = (props: {
  name: string
  check_sound?: string
  uncheck_sound?: string
  onClick?: any
  initialState?: boolean
}) => {
  const [checked, setChecked] = useState<boolean>()
  // Default prop values
  const {
    name = 'setting_default',
    initialState = false,
    check_sound = '',
    uncheck_sound = '',
    onClick = () => console.log('Default Switch Press Behaviour'),
    ...restProps
  } = props

  useEffect(() => {
    setChecked(false)
  }, [])

  useEffect(() => {
    setChecked(initialState)
    // console.log('initial checked state: ', initialState, checked)
  }, [initialState])

  useEffect(() => {
    // console.log('new checked state: ', checked)
  }, [checked])

  const [playOn] = useSound(uncheck_sound, { volume: 1 })
  const [playOff] = useSound(check_sound, { volume: 1 })

  const handleClick = (e: any) => {
    // console.log('E.Target.Checked?: ', e.target.checked)
    if (e.target.checked == true) {
      setChecked(true)
    } else {
      setChecked(false)
    }
    onClick(e)
    checked ? playOff() : playOn()
  }
  return (
    <div className={`${styles.switch}` + ' '}>
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={initialState}
        className={`${styles.checkbox}` + ' '}
        onClick={(e) => {
          handleClick(e)
        }}
      ></input>
      <label
        htmlFor={name}
        className={`${styles.label}` + ' border-2 border-text_1'}
      ></label>
    </div>
  )
}

export default Switch
