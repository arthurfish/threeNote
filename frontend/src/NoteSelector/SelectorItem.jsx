import {Button, Form, InputGroup, Stack} from "react-bootstrap";
import {BiCheck, BiEditAlt, BiFile, BiX} from "react-icons/bi";
import _ from "lodash";
import InputGroupText from "react-bootstrap/InputGroupText";
import React from "react";
import {deleteNote} from "../DAO.js";

const SelectorItem = ({title, id, openNote, isSelected, noteEditingId, setNoteEditingId, setNotes}) => {
    const rightIconSize = "20px"
    const line = isSelected ?
        <div style={{margin: "-3px", padding: "0", height: "40px", backgroundColor: "#ffffff", width: "6px", borderTopRightRadius:"16px", borderBottomRightRadius:"16px"}}></div> : <div></div>
    const rightIcons = isSelected ? <>
        <BiEditAlt onClick={() => setNoteEditingId(id)} className={""} style={{width: rightIconSize, height: rightIconSize}}/>
        <BiX onClick={() => removeNoteWithConfirm(id, setNotes)} style={{width: rightIconSize, height: rightIconSize, marginRight:"20px"}}/>
    </> : <></>
    const [inputText, setInputText] = React.useState("")

    const setTitle = (noteId, newTitle, setNotes) => {
        console.log("[SelectorItem] setTitle: " + noteId + " " + newTitle)
        setNoteEditingId(null)
        setNotes(prevNotes => {
            const remNotes = prevNotes.filter(note => note.id !== noteId)
            const oldNote = prevNotes.find(note => note.id === noteId)
            const newNotes = remNotes.concat({id: noteId, title: newTitle, content: oldNote.content})
            console.log("[SelectorItem] newNotes: " + JSON.stringify(newNotes))
            return newNotes
        })
    }

    const removeNote = (noteId, setNotes) => {
        setNotes(prevNotes => {
            deleteNote(noteId)
            return prevNotes.filter(note => note.id !== noteId)
        })
    }

    const removeNoteWithConfirm = (noteId, setNotes) => {
        if (window.confirm("Are you sure to delete this note?")){
            removeNote(noteId, setNotes)
        }
    }

    console.log("[SelectorItem] noteEditingId: " + noteEditingId)
    if (noteEditingId !== id) {
        return <div style={{margin: "0", padding: "0"}}>
            <Stack style={{margin: "0", padding: "0", paddingBottom: "30px"}} direction={"horizontal"} gap={3}>
                {line}
                <BiFile className={"p-1"} style={{width: "10%", height: "10%"}}/>
                <p onClick={() => openNote(id)} className={""} style={{fontFamily: "Poppins", margin: "0", fontSize: "15px", textAlign:"start", width:"60%"}}>{_.truncate(title, {length: 15})}</p>
                {rightIcons}
            </Stack>
        </div>
    }else return <div style={{margin: "0", padding: "0"}}>
        <Stack style={{margin: "0", padding: "0", paddingBottom: "30px"}} direction={"horizontal"} gap={3}>
            {line}
            <InputGroup>
                <Form.Control onChange={(event) => setInputText(event.target.value)} type="text" placeholder="New Note" style={{border: "none", boxShadow: "none", outline: "none", fontFamily: "Poppins", fontSize: "15px", width: "160px"}}/>
                <Button onClick={() => setTitle(id, inputText, setNotes)} className={"float-right"}><BiCheck /></Button>
                <Button onClick={() => setNoteEditingId(null)}><BiX /></Button>
            </InputGroup>
        </Stack>
    </div>
}

export default SelectorItem;