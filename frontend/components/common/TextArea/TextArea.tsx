import styles from './textarea.module.scss'

const TextArea = (props: {
  [x: string]: any
  text?: string
  className?: string
  placeholder?: string
}) => {
  // Default prop values
  const { placeholder = '', className = '', text = '', ...restProps } = props

  return (
    // <input
    //   className={
    //     `${'rounded-sm bg-back_4 py-1 px-2 text-text_1 focus:outline-none focus:ring focus:ring-back_2'} ` +
    //     className
    //   }
    //   defaultValue={text}
    //   placeholder={placeholder}
    //   type="text"
    // ></input>
    <div
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      className={
        `${className}` +
        ' mb-2 inline h-[150px] overflow-y-auto break-words rounded-sm bg-back_4 py-2 px-3 text-text_1 hover:cursor-text focus:outline-none focus:ring focus:ring-back_2'
      }
    >
      {text}
    </div>
  )
}

export default TextArea
