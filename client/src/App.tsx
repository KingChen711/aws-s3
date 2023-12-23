import { useCallback, useEffect, useState } from 'react'
import uploadIcon from '../src/assets/upload.png'
import axios from 'axios'
import { Post } from './types'

function App() {
  const [fileImage, setFileImage] = useState<File | null>(null)
  const [formValues, setFormValues] = useState({
    title: '',
    content: ''
  })
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [creatingPost, setCreatingPost] = useState(false)

  const fetchPosts = useCallback(async () => {
    const response = await axios.get('http://localhost:5000/api/posts')

    if (response.status === 200) {
      setPosts(response.data.posts)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreatingPost(true)
    const formData = new FormData()
    formData.append('image', fileImage as any)
    formData.append('title', formValues.title)
    formData.append('content', formValues.content)

    const response = await axios.post('http://localhost:5000/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.status === 200) {
      console.log('Hello')

      setFileImage(null)
      setFormValues({ title: '', content: '' })
      fetchPosts()
    }

    setCreatingPost(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  return (
    <div className='mx-8 mt-16 grid grid-cols-12 gap-4'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-xl col-span-6'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='title' className='font-medium'>
            Title
          </label>
          <input
            value={formValues.title}
            onChange={handleChange}
            name='title'
            id='title'
            type='text'
            placeholder='Enter title'
            className='border-slate-400 border py-2 px-4 rounded-md'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor='content' className='font-medium'>
            Content
          </label>
          <textarea
            value={formValues.content}
            onChange={handleChange}
            name='content'
            id='content'
            rows={3}
            placeholder='Enter content'
            className='border-slate-400 border py-2 px-4 rounded-md'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <div className='font-medium'>Image</div>
          <label className='size-32 border-slate-400 border flex justify-center items-center rounded-md cursor-pointer'>
            <img src={uploadIcon} className='size-20' />
            <input onChange={(e) => setFileImage(e.target?.files?.[0] || null)} type='file' className='hidden' />
          </label>
        </div>

        <button
          disabled={creatingPost}
          type='submit'
          className='px-4 py-2 rounded-md bg-slate-700 ml-auto w-fit text-white disabled:opacity-50 flex items-center'
        >
          {!creatingPost ? (
            'Create post'
          ) : (
            <>
              Creating... <img src={uploadIcon} className='animate-spin size-7 ml-1' />
            </>
          )}
        </button>
      </form>

      {isLoading ? (
        <div>Loading posts...</div>
      ) : (
        <div className='col-span-6 flex flex-wrap gap-4'>
          {posts.map((post) => (
            <div className=''>
              <div className='font-medium'>{post.title}</div>
              <div>{post.content}</div>
              <img className='w-48' src={post.imageUrl} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
