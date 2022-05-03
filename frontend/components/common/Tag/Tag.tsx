import { FiX } from 'react-icons/fi'
import styles from './tag.module.scss'

const Tag = (props: { [x: string]: any; text?: string }) => {
  // Default prop values
  const { text = '', ...restProps } = props

  return (
    <span className=" my-1 inline-flex h-7 w-64 flex-row items-center  whitespace-nowrap rounded-md bg-back_2 py-0.5 pr-3 ">
      <div className="flex h-7 w-7 items-center rounded-l-md px-1 text-accent_1 hover:cursor-pointer hover:bg-red-600">
        <FiX className="m-auto block"></FiX>
      </div>
      <p className="overflow-hidden overflow-ellipsis border-l-2 border-back_3 pl-2">
        {text}
      </p>
    </span>
  )
}

export default Tag
