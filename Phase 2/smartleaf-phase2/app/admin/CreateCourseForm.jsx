'use client'
import { createCourse } from '../actions/server-actions2'

export default function CreateCourseForm({ onDone, onCancel }) {
    async function handleSubmit(e) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const res = await createCourse(fd)
        if (res.error) alert(res.error)
        else onDone(res)
    }

    return (
        <form onSubmit={handleSubmit} className="form-create">
            <h2>New Course</h2>
            <input name="id" placeholder="Course ID" required />
            <input name="name" placeholder="Name" required />
            <input name="category" placeholder="Category" />
            <input name="prerequisite" placeholder="Prerequisite" />
            <label>
                <input type="checkbox" name="openForRegistration" defaultChecked /> Open
            </label>
            <select name="stage">
                <option value="draft">Draft</option>
            </select>
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}