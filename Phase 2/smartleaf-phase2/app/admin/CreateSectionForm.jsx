'use client'
import { createSection } from '../actions/server-actions2'
import "@/public/phase1/admin/create-class-course.css"

export default function CreateSectionForm({ course, onDone, onCancel }) {
  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await createSection(course.id, fd)
    if (res.error) alert(res.error)
    else onDone(res)
  }

  return (
    <form onSubmit={handleSubmit} className="form-create">
      <h2>Add Section to {course.id}</h2>
      <input name="id" placeholder="Section ID" required />
      <input name="instructor" placeholder="Instructor" required />
      <input name="timing" type="number" placeholder="Timing" required />
      <input name="capacity" type="number" placeholder="Capacity" required />
      <input name="minRegistrations" type="number" placeholder="Min Regs" defaultValue={10} required />
      <label>
        <input type="checkbox" name="approved" /> Approved
      </label>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}