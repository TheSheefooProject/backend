import styles from './tooltip.module.scss'

const SIDES = {
  left: {
    top: '10px',
    right: '115%',
  },
  right: {
    top: '10px',
    left: '115%',
  },
  top: {
    width: '120px',
    bottom: '100%',
    left: '50%',
    marginLeft: '-60px',
  },
  bottom: {
    width: '120px',
    top: '100%',
    left: '50%',
    marginLeft: '-60px',
  },
}
const Tooltip = (props: {
  [x: string]: any
  text?: string
  className?: string
  placeHolder?: string
  side: keyof typeof SIDES
}) => {
  // Default prop values
  const {
    placeholder = '',
    className = '',
    text = 'text',
    side = 'right',
    ...restProps
  } = props

  return (
    <span
      style={SIDES[side]}
      className={`${
        styles.tooltip +
        ' tooltip bg-back_4 text-text_1 transition-opacity after:border-y-transparent after:border-r-back_4 after:border-l-transparent motion-reduce:transition-none' +
        className
      }`}
    >
      {text}
    </span>
  )
}

export default Tooltip
