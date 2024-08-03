import {Stack} from "react-bootstrap";
import {BiSave} from "react-icons/bi";

const QuillToolbar = ({saveNote}) => {
    return <Stack id="toolbar" gap={4} direction={"horizontal"} style={{padding: "5px"}}>
        <BiSave onClick={saveNote} style={{height:"1.5rem", width:"1.5rem", color:"#6610F2"}}/>
        <button className="ql-image"></button>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <select className="ql-color">
            <option value="red"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="orange"></option>
            <option value="violet"></option>
            <option value="#d0d1d2"></option>
            <option selected></option>
        </select>
        <button className={"ql-underline"}/>
        <button className={"ql-strike"}/>
    </Stack>
}

const quillModules = {
    toolbar: {
        container: "#toolbar",
    }
}

export { QuillToolbar, quillModules };