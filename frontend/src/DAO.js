const port = 2333


const fetchNotes = (setNotes) => {
    const response = fetch('http://localhost:2333/notes');
    response.then((res) => {
        console.log(`[DAO] Fetch notes response: ${JSON.stringify(res)}`);
        res.json().then((data) => {
            setNotes(data);
        });
    });
}

const fetchAiResponse = (prompt) => {
    const response = fetch('http://localhost:2333/ai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({prompt})
    }).then((res) => res.json()).then((data) => console.log(`[DAO] AI : ${JSON.stringify(data)}`))
    return response
}

const fetchGptResponse = (prompt) => {
    return new EventSource(`http://localhost:${port}/gpt/?prompt=${encodeURIComponent(prompt)}`)
}

const updateAllNotes = (notes) => {
    fetch('http://localhost:2333/notes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({notes})
    }).then((res) => console.log(`[DAO] Update notes response: ${JSON.stringify(res)}`))
}

export { fetchNotes, fetchAiResponse, fetchGptResponse, updateAllNotes };