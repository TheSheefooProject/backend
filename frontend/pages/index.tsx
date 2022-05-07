import type { NextPage } from 'next'
import Head from 'next/head'
import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../components/common/Button'
import TextBox from '../components/common/TextBox'
import { FiPlus, FiX } from 'react-icons/fi'
import Tag from '../components/common/Tag'
import {
  create_post,
  get_all_posts,
  get_userdetails_by_id,
  get_user_details_api,
} from '../helpers/api_helper'
import e from 'cors'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const [modal_showing, setModalShowing] = useState<boolean>()
  const [valPosts, setValPosts] = useState<any>([])
  const [posts, setPosts] = useState([])

  const [users, setUsers] = useState([])

  const [createPostImgURL, setCreatePostImgURL] = useState<string>('xVpI0.jpeg')

  const [textboxHeight, setTextboxHeight] = useState(40)

  const [tagToAdd, setTagToAdd] = useState('')
  const [postTags, setPostTags] = useState<Array<string>>([])

  const [contentToAdd, setContentToAdd] = useState('')
  const [titleToAdd, setTitleToAdd] = useState('')

  const posts_div = useRef<any>(null)

  const router = useRouter()

  const showModal = (val: boolean) => {
    if (val === true) {
      setModalShowing(true)
    }
    if (val === false) {
      setModalShowing(false)
    }
  }

  useEffect(() => {
    refreshPosts()
    setTimeout(() => {
      posts_div.current.scroll(0, posts_div.current.scrollHeight)
    }, 500)
  }, [])

  const refreshPosts = async () => {
    var valid_posts: any = []

    await get_all_posts(localStorage?.refresh_token).then((e) => {
      e.allPosts.map((post: any) => {
        // If valid fields in post

        if (Object.keys(post).length >= 10) {
          get_userdetails_by_id(post.author).then((data) => {
            if (data.status == 'success') {
              post.username = data.data.username
              post.avatar = data.data.profile_pic_url

              valid_posts.push(post)
              setValPosts([...valPosts, post])
              setPosts(valid_posts)
            }
          })
        }
      })
    })
  }

  const recalculateHeight = (e: any) => {
    setTextboxHeight(e.target.offsetHeight)
  }
  const calculateModalOffset = () => {
    let value = textboxHeight + 16
    let output = value + 'px'

    return output
  }
  const getCreatePostImageURL = () => {
    let tempval = createPostImgURL
    var value = 'http://i.imgur.com/' + tempval
    if (
      tempval.substring(tempval.length - 4, tempval.length) ==
      ('.jpg' || '.png')
    ) {
      value = 'http://i.imgur.com/' + tempval
    } else {
      value = 'http://i.imgur.com/' + tempval + '.jpg'
    }
    return value
  }
  const addPostTag = (e?: any) => {
    if (e != undefined) {
      if (e.key == 'Enter') {
        if (postTags.includes(tagToAdd)) {
          return 'Tag already exists'
        } else {
          if (postTags.length <= 2) {
            setPostTags([...postTags, tagToAdd])
          } else {
            return 'Maximum Tags reached'
          }
        }
      }
    } else {
      if (postTags.includes(tagToAdd)) {
        return 'Tag already exists'
      } else {
        if (postTags.length <= 2) {
          setPostTags([...postTags, tagToAdd])
        } else {
          return 'Maximum Tags reached'
        }
      }
    }
  }

  const removePostTag = (itemToRemove: any) => {
    setPostTags(postTags.filter((item) => item !== itemToRemove))
  }

  const createPost = () => {
    interface IPost {
      title: string
      content: string
      first_hashtag: string
      second_hashtag: string
      third_hashtag: string
      imageURL: string
    }
    // console.log(postTags, getCreatePostImageURL(), titleToAdd, contentToAdd)

    var postObject: IPost = {
      title: titleToAdd || 'Default Title',
      content: contentToAdd || 'Default Content',
      first_hashtag: postTags[0],
      second_hashtag: postTags[1],
      third_hashtag: postTags[2],
      imageURL: getCreatePostImageURL(),
    }

    create_post(
      postObject.title,
      postObject.content,
      postObject.first_hashtag,
      postObject.second_hashtag,
      postObject.third_hashtag,
      postObject.imageURL
    )
  }

  const convertTime = (time_in: string) => {
    let time_out = ''
    time_out = time_in.substring(0, time_in.indexOf('T'))
    return time_out
  }
  return (
    <main className=" flex h-screen min-h-screen w-full flex-row items-stretch overflow-x-hidden bg-back_2 md:pl-20">
      <Head>
        <title>Sheefoo</title>
      </Head>
      {/* Main Container */}
      <div className="relative mx-2 my-2 flex h-auto w-full flex-col rounded-md bg-back_3 px-2 md:mx-4 md:my-4">
        {/* Homescreen Feed */}
        <div
          ref={posts_div}
          className={
            `${
              modal_showing
                ? ' pointer-events-none blur brightness-[.75]'
                : ' pointer-events-auto blur-0 brightness-100'
            }` +
            ' flex  flex-1 flex-col items-stretch overflow-y-scroll transition-all'
          }
        >
          <div id="feed" className=" flex flex-col  pt-2 ">
            {posts.map((post: any) => (
              <div
                key={post.createdAt + new Date().toLocaleTimeString()}
                className="relative flex flex-row rounded-md p-2"
              >
                {/* Profile Picture */}
                <div>
                  <div className="relative mr-2 h-12 w-12 overflow-hidden rounded-full">
                    <img src={post.avatar}></img>
                  </div>
                  <span>{post.username || '...'}</span>
                </div>

                {/* Post */}
                <div className="grid w-full grid-cols-[auto_minmax(900px,_1fr)] rounded-md bg-back_4 p-2">
                  {/* Post Picture */}
                  {post.imageURL != undefined ? (
                    <div className="relative h-24 w-24 overflow-hidden">
                      <div
                        style={{
                          backgroundImage:
                            'url(' + post.imageURL + ')' ||
                            'url(/images/thispersondoesnotexist.jpg)',
                        }}
                        className="h-full w-full bg-cover bg-center bg-no-repeat"
                      ></div>
                    </div>
                  ) : (
                    <div className="w-0"></div>
                  )}

                  <div className="ml-2">
                    {/* Post Title */}
                    <div className=" font-heading text-lg font-semibold tracking-widest text-accent_2 ">
                      {post.title}
                    </div>
                    {/* Post Content */}
                    <div className="font-body">
                      {post.content}{' '}
                      <span className="absolute bottom-3 right-4 text-sm text-gray-400">
                        {convertTime(post.createdAt) || '...'}
                      </span>
                    </div>
                    {/* Tags */}
                    <div className=" absolute -top-1 right-4 flex gap-1 font-heading">
                      {post.first_hashtag != '' && (
                        <span className="rounded-sm bg-accent_1 px-2 py-0.5 text-black ">
                          {post.first_hashtag}
                        </span>
                      )}

                      {post.second_hashtag != '' && (
                        <span className="rounded-sm bg-accent_1 px-2 py-0.5 text-black">
                          {post.third_hashtag}
                        </span>
                      )}
                      {post.third_hashtag != '' && (
                        <span className="rounded-sm bg-accent_1 px-2 py-0.5 text-black">
                          {post.second_hashtag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Text input box */}
        <div
          id="text_input_container"
          className={
            `${modal_showing ? ' mt-0' : 'mt-auto'}` +
            ' relative mt-2 max-h-[30vh] w-[100%] border-t-2 border-accent_2 py-2'
          }
        >
          <div
            role="textbox"
            contentEditable
            title="Create New Post"
            className=" max-h-[28vh] w-[100%] overflow-y-auto break-all rounded-md bg-back_1 py-2 pr-[165px] pl-3  text-text_1 focus:outline-none focus:ring focus:ring-back_2"
            onFocus={() => showModal(true)}
            onKeyUp={(e: any) => {
              recalculateHeight(e)
              setContentToAdd(e.target.innerText)
            }}
            // onBlur={() => showModal(false)}
          ></div>
          <div
            id="action_buttons_container"
            className="absolute right-0 bottom-2 rounded-l-md bg-back_3 px-0.5 py-1 "
          >
            <Button
              noMargin
              type="positive"
              fixedWidth
              text="Submit Post"
              className="mx-0.5"
              onClick={() => {
                createPost()
                setModalShowing(false)
                posts_div.current.scroll(0, posts_div.current.scrollHeight)
                router.reload()
              }}
            ></Button>
            <Button
              noMargin
              type="negative"
              fixedWidth
              icon={<FiX></FiX>}
              iconOnly
              className="mx-0.5"
              onClick={() => {
                showModal(false)
              }}
            ></Button>
          </div>
        </div>
        {/* Modal Container */}
        <div
          id="modal_container"
          className={` pointer-events-none absolute  flex h-[100%] w-[99%] flex-col justify-between`}
        >
          {/* Modal (shown when input is focused) */}
          <div
            style={{ marginBottom: calculateModalOffset() }}
            className={
              `${
                modal_showing
                  ? ' opacity-1 pointer-events-auto '
                  : ' pointer-events-none opacity-0 '
              }` +
              '  mt-auto flex flex-col-reverse items-center pr-4 transition-opacity md:flex-row md:items-end md:pr-0'
            }
          >
            {/* Upload Image GRID */}
            <div className=" mb-3 flex w-[100%] flex-col rounded-md bg-back_2 md:w-[auto]">
              {/* Uploaded Image */}
              <div
                id="image_container"
                className="m-auto mt-2 mb-2 flex w-max items-center justify-center rounded-md bg-back_4 p-2 drop-shadow-md"
              >
                <Image
                  className="shadow-lg"
                  src={getCreatePostImageURL()}
                  width={300}
                  height={300}
                ></Image>
              </div>
              <div className="flex flex-row">
                <span className=" text-text_1md:w-64 mt-1 mr-1 ml-1 h-8 w-[100%] rounded-l-md bg-back_4 pl-4 pr-1 leading-8 ">
                  https://i.imgur.com/
                </span>
                <input
                  type="text"
                  placeholder="scajbuz.jpg"
                  className=" placeholder:text-text_3 mt-1 mb-1 mr-1 h-8 w-[100%] rounded-r-md bg-back_4 pl-1 pr-4 text-text_1 focus:outline-none focus:ring focus:ring-back_2 md:w-64"
                  onChange={(e) => setCreatePostImgURL(e.target.value)}
                ></input>
              </div>
            </div>
            {/* Title + Tags Container */}
            <div className=" flex w-full flex-col-reverse sm:mr-6 lg:mr-0 lg:flex-row">
              {/* Title GRID */}
              <div className="mb-0 flex w-[100%] flex-col-reverse items-end rounded-md text-text_1 md:mb-1">
                <input
                  type="text"
                  placeholder="Enter a Title"
                  className="placeholder:text-text_4 my-2 h-8 w-[100%] rounded-md bg-back_4 px-4 text-text_1 focus:outline-none focus:ring focus:ring-back_2 md:w-64"
                  onChange={(e) => setTitleToAdd(e.target.value)}
                />
              </div>
              {/* Tags GRID */}
              <div
                className={
                  'mb-0 flex w-[100%] flex-col-reverse items-end rounded-md text-text_1 md:mb-3 '
                }
              >
                <div
                  className="relative w-[100%] md:w-64"
                  id="tag_input_container"
                >
                  <input
                    type="text"
                    placeholder="Add Tag"
                    className=" mt-1 h-8 w-[100%] rounded-md bg-back_4 px-4 text-text_1 placeholder:text-text_1 focus:outline-none focus:ring focus:ring-back_2 md:w-64"
                    onChange={(e) => setTagToAdd(e.target.value)}
                    onKeyUp={(e: any) => {
                      addPostTag(e)
                    }}
                  ></input>
                  <Button
                    iconOnly
                    noMargin
                    type="neutral"
                    fixedWidth
                    icon={<FiPlus></FiPlus>}
                    className="absolute right-0 bottom-0"
                    onClick={() => {
                      addPostTag()
                    }}
                  ></Button>
                </div>

                <div className="flex flex-col-reverse items-end " id="tags">
                  {postTags.map((tag) => (
                    <Tag
                      key={postTags.indexOf(tag)}
                      text={tag}
                      onClick={() => removePostTag(tag)}
                    ></Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
