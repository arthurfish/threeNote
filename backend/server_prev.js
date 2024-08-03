const databaseUri = require('./databaseUri.js');
const {PnoteModel} = require('./NoteModel.js');
const express = require('express');
const mongoose = require('mongoose');
const {Pnote} = require('./NoteModel.js');
const cors = require('cors');
const {json} = require("express");
const OpenAI = require('openai');

const app = express();
const port = 2333;

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

    app.get('/note-list', (req, res) => {
        PnoteModel.find().then((notes, err) => {
            if (err) {
                console.error(err);
            } else {
                res.json(notes)
                console.log("Send Note List to client.")
            }
        })
    })

    app.get('/note/:id', (req, res) => {
        PnoteModel.findOne({id: req.params.id}).then((note, err) => {
            console.log("Find Note by id. id: " + req.params.id)
            if (err) {
                console.error(err);
            } else {
                res.json(note)
                console.log("Send Note to client.")
            }
        })
    })

    app.put('/note/:id', (req, res) => {
        console.log("request body : " + JSON.stringify(req.body))
        console.log("request params: " + JSON.stringify(req.params))
        PnoteModel.findOneAndUpdate({id: req.params.id}, req.body).then((note) => {
            console.log("Update Note by id. id: " + req.params.id)
            res.json(note)
            console.log("[Server] Note updated.")
            console.log(`[Server] Updtaed Note: ${JSON.stringify(note)}`)
        })
    })

    app.get('/ai/:paraid', async (req, res) => {
        //use chatgpt api to generate sth. chating message including in req body as prompt
        //return the generated message
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const client = new OpenAI(process.env.OPENAI_API_KEY);
        const para = decodeURIComponent(req.query.params);
        console.log("[Ai] para: " + para)

        const stream = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: para}],
            stream: true,
        });

        try {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    res.write(`event: message\n`);
                    res.write(`data: ${content}\n`);
                    res.write(`id: ${req.params.paraid}\n\n`);
                    console.log(`Send AiResponse to client: [${req.originalUrl}]` + content)
                }
            }
        } catch (error) {
            console.error('Error while streaming:', error);
            res.write("ERR")
        } finally {
            res.write("event: end\n")
            res.write("data: end\n\n")
            res.write("id: " + req.params.paraid + "\n\n")
            res.end();
        }
    })

    app.get("/ai/:paraid", (req, res) => {
        res.send("WTF?")
        console.log("WTF?")
        console.log("req.params: " + JSON.stringify(req.params))
    })
}


startServer()