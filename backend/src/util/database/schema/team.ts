import mongoose from 'mongoose'
const { Schema } = mongoose;

export const teamSchema = new Schema({
    allianceName: {
        type: String,
        unique: true
    },
    points: Number
})

teamSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);
  
    return one || this.create(doc);
  });