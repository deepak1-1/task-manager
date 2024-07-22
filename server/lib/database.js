import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDatabase = async (callback = () => {}) => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        callback()
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

export default connectDatabase
