import mongoose from 'mongoose'

const { Schema, model } = mongoose

const UserSchema = new Schema(
    {
        name: {
            first: {
                type: String,
                required: true,
            },
            last: {
                type: String,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export const User = model('user', UserSchema)
