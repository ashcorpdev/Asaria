import mongoose from 'mongoose'
const { Schema } = mongoose;

export const userSchema = new Schema({
    twitchId: {
        type: Number,
        unique: true
    },
    displayName: String,
    points: Number,
    allianceName: String
})