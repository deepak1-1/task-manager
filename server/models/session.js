import mongoose from 'mongoose'

const { Schema, model } = mongoose

const SessionSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        token: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

export const Session = model('session', SessionSchema)
