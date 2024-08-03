import {fetchAiResponse} from "./DAO.js";

const SquareButton = ({callback}) => {
    return <div
        onClick={() => {
        callback()
    }}
        style={{
        width: "50px",
        height: "50px",
        backgroundColor: "#6610f2",
        color: "#ffffff",
        position: "fixed",
        bottom: "100px",
        right: "20px",
        borderRadius: "10px",
    }}>
        <div
            style={{
                width: "500px",
                height: "50px",
                backgroundColor: "#6610f2",
                color: "#ffffff",
                position: "absolute",
                borderRadius: "10px",
            }}
        ></div>
        <p style={{
            fontFamily: "Poppins", fontWeight: "700", fontSize: "30px", position: "absolute", top: "0", left: "10px"
        }}>AI</p></div>
}

export default SquareButton;