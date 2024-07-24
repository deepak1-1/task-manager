import mongoose from 'mongoose'

const { Schema, model } = mongoose

const TaskSchema = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            default: 'TO DO',
        },
        dueDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
)

export const Task = model('task', TaskSchema)
