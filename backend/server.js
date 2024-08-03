const _ = require('lodash');
const app = require('express')();
const express = require('express');
const cors = require('cors');
const {NoteModel} = require("./NoteModel");
const port = 2333;
const mongoose = require('mongoose');
const databaseUri = require('./databaseUri');
const {invokeLocalLLM} = require("./invokeLocalLLM");
const OpenAI = require("openai");

async function startServer() {

    await mongoose.connect(databaseUri)

    app.use(cors({
        origin: 'http://localhost:5173'
    }));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.set('port', port)
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    app.get('/notes', (req, res) => {
        console.log("Get request to /notes")
        NoteModel.find().then((notes, err) => {
            if (err) {
                console.error(err);
            } else {
                res.json(notes)
                console.log("Send Note List to client.")
            }
        })
    })

    app.post('/ai', (req, res) => {
        console.log("Post request to /ai")
        console.log(`[Server] Request body: ${JSON.stringify(req.body)}`)
        invokeLocalLLM(req.body.prompt, (data) => {
            console.log(`[Server] Invoke Local LLM result: ${JSON.stringify(data)}`)
            res.json({content: data})
        })
    })

    app.get('/gpt', async (req, res) => {
        //use chatgpt api to generate sth. chating message including in req body as prompt
        //return the generated message
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const client = new OpenAI(process.env.OPENAI_API_KEY);
        const prompt = decodeURIComponent(req.query.prompt);
        console.log("[Ai] prompt: " + prompt)

        const stream = await client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{role: 'user', content: prompt + "（如果有公式请把公式用latex语法表示并放到$$..$$里面）"}],
            stream: true,
        });
//WTF?
        try {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    res.write(`event: message\n`);
                    res.write(`data: ${JSON.stringify({content})}\n\n`);
                    console.log(`Send AiResponse to client: [${req.originalUrl}]` + JSON.stringify({content}))
                }
            }
        } catch (error) {
            console.error('Error while streaming:', error);
            res.write("ERR")
        } finally {
            res.write("event: end\n")
            res.write("data: end\n\n")
            res.end();
        }
    })

    app.put("/notes", (req, res) => {
        console.log("put request to /notes")
        console.log(`[Server] Request body: ${JSON.stringify(req.body)}`)
        for (const note of req.body.notes) {
            NoteModel.findOneAndUpdate({id: note.id}, note, {upsert: true}).then(() => {
                console.log(`Update Note titled ${note.title}to DB.`)
            })
        }
    })

    app.delete("/note/:noteId", (req, res) => {
        console.log("Delete request to /note/:noteId")
        console.log(`[Server] Request body: ${JSON.stringify(req.params)}`)
        NoteModel.findOneAndDelete({id: req.params.noteId}).then(() => {
            console.log(`Delete Note with id ${req.params.noteId} from DB.`)
        })
    })
}

startServer()
