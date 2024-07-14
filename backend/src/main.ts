import 'dotenv/config'
import express from 'express'
const PORT = process.env.PORT || '5001'
import cors from 'cors'
import db from './db'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello there!',
    })
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await db.post.findMany()

        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/posts/:id', async (req, res) => {
    const { id }: { id: string | undefined } = req.params
    const queriedId = Number(id)
    try {
        const queriedPost = await db.post.findUnique({
            where: { id: queriedId },
        })
        if (!queriedPost) {
            throw new Error(`Post with id ${id} is not found`)
        }

        res.status(200).json(queriedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})
app.delete('/posts/:id', async (req, res) => {
    const { id }: { id: string | undefined } = req.params
    const queriedId = Number(id)
    try {
        const deletedPost = await db.post.delete({
            where: { id: queriedId },
        })
        if (!deletedPost) {
            throw new Error(`Post with id ${id} is not found`)
        }

        res.status(200).json(deletedPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

app.post('/posts', async (req, res) => {
    const {
        title,
        content,
    }: { title: string | undefined; content: string | undefined } = req.body

    try {
        if (!title) {
            throw new Error('Post title is required')
        }

        const createdPost = await db.post.create({
            data: {
                title,
                content,
            },
        })

        res.status(200).json(createdPost)
    } catch (err) {
        console.log(err)
        if (err instanceof Error) {
            res.status(400).json({ error: err.message })
            return
        }
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})
