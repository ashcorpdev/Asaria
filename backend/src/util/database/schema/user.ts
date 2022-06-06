import mongoose from 'mongoose'
const { Schema } = mongoose;

export const userSchema = new Schema({
    displayName: String,
    points: Number
})

userSchema.static('findOneOrCreate', async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);
  
    return one || this.create(doc);
  });