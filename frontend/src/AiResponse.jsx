import {useState} from "react";
import Markdown from "react-markdown";
import SquareButton from "./SquareButton.jsx";
import "github-markdown-css/github-markdown.css"
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css'

const AiResponse = ({quillRef}) => {
    const [aiResponse, setAiResponse] = useState("")
    const startCommunication = () => {
        console.log("[AiResponse] startCommunication")
        setAiResponse("")
        quillRef.current.editor.focus()
        let selection = quillRef.current.editor.getSelection()
        if (selection.length === 0) {
           selection = {index: 0, length: quillRef.current.editor.getLength()}
        }
        const text = quillRef.current.editor.getText(selection?.index, selection?.length)
        const eventSource = new EventSource(`http://localhost:2333/gpt?prompt=${text}`);
        eventSource.addEventListener("message", (event) => {
            const content = JSON.parse(event.data).content
            console.log(`[AiResponse] event.data.content: ${content}`)
            setAiResponse(aiResponse => aiResponse + content)
        })
        eventSource.addEventListener("error",  (event) => {
            console.error(`[AiResponse] event: ${JSON.stringify(event.data)}`)
            eventSource.close()
        })
    }
    return <div style={{
        overflowY: "overlay",
        textAlign: "start",
        height: "100vh"
    }}>
        <Markdown className={"markdown-body"} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} style={{width:"100%", height:"100%", textAlign:"start"}}>{aiResponse}</Markdown>

        <SquareButton callback={startCommunication}/>
    </div>
}

export default AiResponse;