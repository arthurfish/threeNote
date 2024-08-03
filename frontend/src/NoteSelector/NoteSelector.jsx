import PropTypes from "prop-types";
import {Stack} from "react-bootstrap";
import SelectorItem from "./SelectorItem.jsx";
import {useState} from "react";

const NoteSelector = ({notes, openNote, titleEditingId, setTitleEditingId, setNotes} ) => {
    const [selectedNote, setSelectedNote] = useState(null)
    let enableId = selectedNote
    if (titleEditingId !== null){
        enableId = titleEditingId
    }
    return <Stack style={{margin: "0", padding: "0"}}>{
        notes.map((note) => {
            return <SelectorItem
                title={note.title}
                id={note.id}
                openNote={() => {
                    setSelectedNote(note.id)
                    setTitleEditingId(null)
                    openNote(note.id)
                }}
                isSelected={selectedNote === note.id}
                noteEditingId={titleEditingId}
                setNoteEditingId={setTitleEditingId}
                setNotes={setNotes}
            />
        })
    }</Stack>

}

NoteSelector.propTypes = {
    notes: PropTypes.array,
    openNote: PropTypes.func
}

export default NoteSelector;