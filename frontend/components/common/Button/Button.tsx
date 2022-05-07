import React from 'react'
import styles from './button.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const Button = (props: {
  [x: string]: any
  text?: string
  className?: string
  type?: keyof typeof typeColours
  disabled?: boolean
  noMargin?: boolean
  fixedWidth?: boolean
  iconOnly?: boolean
  icon?: React.ReactElement
}) => {
  // Default prop values
  const {
    icon = '',
    text = '',
    type = 'default',
    disabled = false,
    className = '',
    bg_colour = '#4FDC7C',
    onClick = null,
    noMargin = false,
    fixedWidth = false,
    iconOnly = false,
    ...restProps
  } = props

  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor: typeColours[type],
      }}
      className={`${
        (noMargin ? ' m-0 ' : ' m-1 ') +
        (fixedWidth ? ' w-28 ' : ' w-[100%] ') +
        (iconOnly ? ' w-8 ' : ' ') +
        className +
        ' ' +
        styles.btn +
        ' h-8 w-[100%] px-2 py-0 font-body font-medium text-white shadow-md transition-transform hover:scale-95 hover:shadow-none motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:brightness-90 '
      }`}
      onClick={onClick}
    >
      {/* Button Icon */}
      <span>{icon}</span>
      {/* Button Text  */}
      {text}
    </button>
  )
}

export default Button
