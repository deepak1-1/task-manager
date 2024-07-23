import { Task } from '../../models/index.js'

export const getTasks = async (req, res) => {
    const sort = req.query.sort ? Number(req.query.sort) : -1
    const search = req.query.search

    const filter = {
        user_id: req.user.userId,
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
        const searchRegex = new RegExp(search.trim(), 'i')
        filter.$or = [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
        ]
    }

    const tasks = await Task.find(filter).sort({ createdAt: sort })

    res.status(200).json({ success: true, data: tasks })
}

export const addTask = async (req, res) => {
    const { title, description } = req.body

    if (!title || !title.trim())
        return res.status(400).json({ success: false, error: 'Invalid Title' })

    const task = new Task({
        title,
        description,
        user_id: req.user.userId,
    })
    await task.save()

    return res
        .status(200)
        .json({ success: true, message: 'Added Task Successfully' })
}

export const updateTask = async (req, res) => {
    const { id = null } = req.params
    const { title = '', description = '' } = req.body

    if (!title || !title.trim() || !id)
        return res.status(400).json({
            success: false,
            error: 'Invalid Data',
        })

    const filter = { _id: id }
    const update = { title, description }

    await Task.updateOne(filter, update)

    return res.status(200).json({
        success: true,
        message: 'Updated Task Successfully',
    })
}

export const deleteTask = async (req, res) => {
    const { id = null } = req.params

    if (!id)
        return res.status(400).json({
            success: false,
            error: 'Invalid Id',
        })

    await Task.deleteOne({ _id: id })

    return res.status(200).json({
        success: true,
        message: 'Deleted Task Successfully',
    })
}
