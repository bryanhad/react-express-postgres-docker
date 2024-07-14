import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import api from './lib/axios'
import { AxiosResponse } from 'axios'

type Post = {
    id: number
    title: string
    content: string | null
}

function App() {
    const [posts, setPosts] = useState<Post[]>([])
    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string | undefined>(undefined)

    useEffect(() => {
        async function getPosts() {
            const { data }: AxiosResponse<Post[]> = await api.get('/posts')
            setPosts(data)
        }
        getPosts()
    }, [])

    async function onSubmit() {
        if (title.length < 1) {
            return alert(`Post's title must be filled`)
        }
        await api.post('/posts', {
            title,
            content,
        })
        setPosts((prev) => {
            return [
                ...prev,
                {
                    id: prev[posts.length - 1].id + 1,
                    content: content ? content : null,
                    title,
                },
            ]
        })
        alert('Post has been added!')
    }
    return (
        <main className="p-5 flex flex-col items-center gap-4">
            <div className="flex gap-10">
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="size-32" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="size-32 spin"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="text-4xl">CRUD Posts!</h1>
            <div className="flex gap-4 justify-center">
                <Container title="Add Post">
                    <form className="flex gap-2 flex-col" onSubmit={onSubmit}>
                        <input
                            className="border p-2 rounded-md"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                            placeholder="Insert Post Title"
                        />
                        <input
                            className="border p-2 rounded-md"
                            type="text"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value)
                            }}
                            placeholder="Insert Post Content"
                        />
                        <button type="submit">ADD POST</button>
                    </form>
                </Container>
                <Container title="Posts" className="flex flex-col gap-2">
                    {posts.length ? (
                        posts.map((post) => (
                            <Post
                                key={post.id}
                                {...post}
                                onDelete={async (toBeDeletedId) => {
                                    await api.delete(`/posts/${toBeDeletedId}`)

                                    setPosts((prev) => {
                                        return prev.filter(
                                            (post) => post.id !== toBeDeletedId
                                        )
                                    })
                                }}
                            />
                        ))
                    ) : (
                        <p className="font-light">No Posts On DB</p>
                    )}
                </Container>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </main>
    )
}

export default App

function Container({
    children,
    title,
    className,
}: {
    children: React.ReactNode
    title: string
    className?: string
}) {
    return (
        <div className={`p-4 rounded-md shadow-md min-w-[500px] ${className}`}>
            <h1 className="text-3xl">{title}</h1>
            {children}
        </div>
    )
}

function Post({
    content,
    id,
    title,
    onDelete,
}: Post & { onDelete: (id: number) => void }) {
    return (
        <div className="p-2 rounded-md relative min-w-[200px] flex flex-col gap-2 border">
            <button
                className="rounded-bl-md rounded-tr-md absolute right-0 top-0 bg-red-400 text-white font-semibold size-6 text-sm"
                onClick={() => onDelete(id)}
            >
                x
            </button>
            <p className="font-semibold">{title}</p>
            <p className="font-light">{content ? content : 'no content'}</p>
        </div>
    )
}
