import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {fetchAiResponse, fetchNotes, updateAllNotes} from "./DAO.js";
import {Col, Container, Row, Stack} from "react-bootstrap";
import {BiFile, BiLogoFacebook, BiLogoInstagram, BiLogoTwitter} from "react-icons/bi";
import { GoCircle } from "react-icons/go";
import "bootstrap/dist/css/bootstrap.min.css"
import NoteSelector from "./NoteSelector/NoteSelector.jsx";
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill";
import SquareButton from "./SquareButton.jsx";
import AiResponse from "./AiResponse.jsx";

function App() {
    const [notes, setNotes] = useState([])
    const [currNoteId, setCurrNoteId] = useState(null)
    const quillRef = useRef(null)
    const percentVar1 = "60%"
    const [titleEditingId, setTitleEditingId] = useState(null)


    useEffect(() => {
        if (notes?.length === 0) {
            fetchNotes(setNotes)
        }
        updateAllNotes(notes)
    }, [notes]);

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
                <NoteSelector notes={notes} setNotes={setNotes} openNote={(id) => setCurrNoteId(id)} titleEditingId={titleEditingId} setTitleEditingId={setTitleEditingId}/>
            </Col>
            <Col xs={"4"} style={{margin:"0", padding:"0", height:"100vh", overflowY:"scoll"}}>
                <ReactQuill
                    style={{height:"100%", width:"100%"}}
                    ref={quillRef} theme={"snow"} value={notes.filter(x=>x.id===currNoteId)[0]?.content}/>
            </Col>
            <Col xs={"5"} style={{paddingLeft: "20px", paddingTop: "20px", paddingRight:"0"}}>
                <AiResponse quillRef={quillRef}/>
            </Col>
        </Row>
    </Container>
}

export default App
