
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks/[id] - Get a specific task
export async function GET(request, { params }) {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: params.id
      }
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT /api/tasks/[id] - Update a specific task
export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const { task, description, started, program, design, date, approved } = body

    const updatedTask = await prisma.task.update({
      where: {
        id: params.id
      },
      data: {
        task,
        description,
        started,
        program,
        design,
        date: date ? new Date(date) : null,
        approved
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a specific task
export async function DELETE(request, { params }) {
  try {
    await prisma.task.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
