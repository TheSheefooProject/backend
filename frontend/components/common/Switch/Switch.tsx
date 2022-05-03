import { MouseEventHandler, useEffect } from 'react'
import styles from './switch.module.scss'
import { useState } from 'react'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const Switch = (props: {
  name: string
  onClick?: any
  initialState?: boolean
}) => {
  const [checked, setChecked] = useState<boolean>()
  useEffect(() => setChecked(initialState))

  // Default prop values
  const {
    name = 'setting_default',
    initialState = false,
    onClick = () => console.log('Default Switch Press Behaviour'),
    ...restProps
  } = props

  return (
    <div className={`${styles.switch}` + ' '}>
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={checked}
        className={`${styles.checkbox}` + ' '}
        onClick={onClick}
      ></input>
      <label
        htmlFor={name}
        className={`${styles.label}` + ' border-2 border-text_1'}
      ></label>
    </div>
  )
}

export default Switch
