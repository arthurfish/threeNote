const databaseUri = require('./databaseUri.js');
const {faker} = require("@faker-js/faker");
const mongoose = require("mongoose");
const {Note} = require('./NoteModel.js');
const _ = require("lodash");
const NoteModel = require('./NoteModel.js').NoteModel;
const uuid = require('uuid')



const makeData = async (number) => {
    await mongoose.connect(databaseUri)
    for(let i = 0; i < number; i++) {
        const note = new NoteModel({
            title: faker.lorem.sentence({min: 3, max: 6}),
            id: uuid.v1(),
            content: {
                ops: _.range(_.random(1, 3)).map(() => {
                    return {
                        insert: faker.lorem.paragraph({min: 1, max: 3})
                    }
                })
            }
        });
        note.save().then(() => console.log(`Note ${i} saved.`));
    }
}
makeData(4)
module.exports = {makeData}