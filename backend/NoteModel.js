const mongoose = require('mongoose');

const Note = {
    title: String,
    id: String,
    content: Object
}

const NoteModel = mongoose.model("threeNote", Note);

module.exports =  {NoteModel, Note}