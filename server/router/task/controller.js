import dayjs from 'dayjs'

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

    const newTaskFormat = {
        toDo: [],
        inProgress: [],
        done: [],
    }

    if (typeof tasks === 'object' && tasks.length >= 0) {
        tasks.map((task) => {
            switch (task?.status) {
                case 'TO DO':
                    newTaskFormat.toDo.push(task)
                    break

                case 'IN PROGRESS':
                    newTaskFormat.inProgress.push(task)
                    break

                case 'DONE':
                    newTaskFormat.done.push(task)
                    break
            }
        })
    }

    res.status(200).json({ success: true, data: newTaskFormat })
}

export const addTask = async (req, res) => {
    const { title = '', description = '', dueDate = '' } = req.body

    if (!title || !title.trim() || !dueDate || !dayjs(dueDate)?.isValid)
        return res.status(400).json({ success: false, error: 'Invalid Data' })

    const task = new Task({
        title,
        description,
        user_id: req.user.userId,
        dueDate,
    })
    await task.save()

    return res
        .status(200)
        .json({ success: true, message: 'Added Task Successfully' })
}

export const updateTask = async (req, res) => {
    const { id = null } = req.params

    if (!id)
        return res.status(400).json({
            success: false,
            error: 'Invalid Data',
        })

    await Task.updateOne({ _id: id }, { $set: req.body })

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
