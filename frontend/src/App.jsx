import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {fetchAiResponse, fetchNotes, updateAllNotes} from "./DAO.js";
import {Button, Col, Container, Row, Stack} from "react-bootstrap";
import {BiFile, BiLogoFacebook, BiLogoInstagram, BiLogoTwitter, BiPlus} from "react-icons/bi";
import { GoCircle } from "react-icons/go";
import "bootstrap/dist/css/bootstrap.min.css"
import NoteSelector from "./NoteSelector/NoteSelector.jsx";
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill";
import SquareButton from "./SquareButton.jsx";
import AiResponse from "./AiResponse.jsx";
import {v1 as uuid} from 'uuid'
import {quillModules, QuillToolbar} from "./QuillToolbar.jsx";
import './quill-arthur-theme.css'

function App() {
    const [notes, setNotes] = useState([])
    const [currNoteId, setCurrNoteId] = useState(null)
    const quillRef = useRef(null)
    const percentVar1 = "60%"
    const [titleEditingId, setTitleEditingId] = useState(null)


    useEffect(() => {
        if (notes?.length === 0) {
            fetchNotes((notes) => {
                setNotes(notes)
                if(notes.length > 0){
                    setCurrNoteId(notes[0].id)
                }
            })
        }
    }, [notes]);

    const createNewNote = () => {
        const newNote = {id: uuid(), title: "New Note", content: "\n"}
        setNotes((prevNotes) => {
            updateAllNotes([...prevNotes, newNote])
            return [...prevNotes, newNote]
        })

        setCurrNoteId(newNote.id)
        setTitleEditingId(newNote.id)
    }

    return <Container style={{overflow:"visible", margin:"0", width:"100vw"}}>
        <Row style={{height:"100vh", width:"100vw"}}>
            <Col xs={"3"} style={{backgroundColor: "#6610f2", color:"#ffffff", padding:"0"}}>
                <Container style={{margin: "10px", padding: "0"}}>
                    <Row className={"justify-content-md-center"} style={{marginTop: "20px", marginBottom:"10px"}}>
                        <Col xs={"2"}>
                            <GoCircle style={{
                                height: "200%",
                                width: "200%",
                                margin: "-20px"
                            }}/>
                        </Col>
                        <Col xs={"8"} style={{paddingTop:"3px", paddingLeft:"1px"}}>
                            <p style={{fontFamily: "Poppins", fontWeight:"700", fontSize:"26px", marginBottom:"2px"}}>
                                ArthurNote</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={"10"} style={{fontFamily:"Poppins", fontWeight:"normal", fontSize:"16px"}}>Give you the best
                            note experience</Col>
                    </Row>
                    <Row className={"justify-content-md-center"} style={{margin:"10px"}}>
                        <Col xs={"3"}>
                            <BiLogoTwitter style={{height:percentVar1, width:percentVar1}}/>
                        </Col>
                        <Col xs={"4"}>
                            <BiLogoFacebook style={{height:percentVar1, width:percentVar1}}/>
                        </Col>
                        <Col xs={"4"}>
                            <BiLogoInstagram style={{height:percentVar1, width:percentVar1}}/>
                        </Col>
                    </Row>
                </Container>
                <div>
                    <Container style={{padding:"0", margin:"0", height:"5rem", marginBottom:"1rem"}}>
                        <Row onClick={createNewNote}>
                            <Col xs={3}/>
                            <Col xs={9} style={{}}>
                                <p style={{fontFamily:"Poppins", fontWeight:"normal", fontSize:"30px", textAlign:"start"}}>＋ New</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={2}/>
                            <Col xs={8} style={{borderBottom: "solid" }}/>
                            <Col xs={2}/>
                        </Row>
                    </Container>
                </div>
                <NoteSelector notes={notes} setNotes={setNotes} openNote={(id) => setCurrNoteId(id)} titleEditingId={titleEditingId} setTitleEditingId={setTitleEditingId} selectCallback={() => updateAllNotes(notes)}/>
            </Col>
            <Col xs={"4"} style={{margin:"0", padding:"0", height:"100vh", overflowY:"scoll"}}>
                <QuillToolbar saveNote={() => setNotes((prevNote) => {
                    const remainNotes = prevNote.filter(x => x.id !== currNoteId)
                    const oldNote = prevNote.filter(x => x.id === currNoteId)[0]
                    quillRef.current.editor.focus()
                    const content = quillRef.current.editor.getContents()
                    console.log(`[App::SaveNote] oldNote: ${JSON.stringify(oldNote)} currNoteId: ${currNoteId}`)
                    const newNote = {id: currNoteId, title: oldNote.title, content: content}
                    updateAllNotes([...remainNotes, newNote])
                    return [...remainNotes, newNote]
                })}/>
                <ReactQuill
                    modules={quillModules}
                    style={{height:"100%", width:"100%"}}
                    ref={quillRef} theme={"snow"} value={notes.filter(x=>x.id===currNoteId)[0]?.content}/>
            </Col>
            <Col xs={"5"} style={{padding: "12px", margin:"0"}}>
                <AiResponse quillRef={quillRef}/>
            </Col>
        </Row>
    </Container>
}

export default App
