import mongoose from 'mongoose'
const { Schema } = mongoose;

export const teamSchema = new Schema({
    allianceName: {
        type: String,
        unique: true
    },
    points: Number
})