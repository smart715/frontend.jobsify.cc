
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch a specific support ticket
export async function GET(request, { params }) {
  try {
    const { id } = params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Support ticket not found' }, { status: 404 })
    }

    // Format the response
    const formattedTicket = {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      subject: ticket.subject,
      description: ticket.description,
      requesterName: ticket.requesterName,
      requesterEmail: ticket.requesterEmail,
      requestedOn: ticket.createdAt.toISOString().split('T')[0],
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      companyId: ticket.companyId,
      companyName: ticket.companyName,
      assignedTo: ticket.assignedTo,
      resolvedAt: ticket.resolvedAt,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    }

    return NextResponse.json(formattedTicket)
  } catch (error) {
    console.error('Error fetching support ticket:', error)
    return NextResponse.json({ error: 'Failed to fetch support ticket' }, { status: 500 })
  }
}

// PUT - Update a support ticket
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        subject: body.subject,
        description: body.description,
        status: body.status,
        priority: body.priority,
        category: body.category,
        assignedTo: body.assignedTo,
        resolvedAt: body.status === 'Resolved' ? new Date() : null,
        updatedAt: new Date()
      }
    })

    // Format the response
    const formattedTicket = {
      id: updatedTicket.id,
      ticketNumber: updatedTicket.ticketNumber,
      subject: updatedTicket.subject,
      description: updatedTicket.description,
      requesterName: updatedTicket.requesterName,
      requesterEmail: updatedTicket.requesterEmail,
      requestedOn: updatedTicket.createdAt.toISOString().split('T')[0],
      status: updatedTicket.status,
      priority: updatedTicket.priority,
      category: updatedTicket.category,
      companyId: updatedTicket.companyId,
      companyName: updatedTicket.companyName,
      assignedTo: updatedTicket.assignedTo,
      resolvedAt: updatedTicket.resolvedAt,
      createdAt: updatedTicket.createdAt,
      updatedAt: updatedTicket.updatedAt
    }

    return NextResponse.json(formattedTicket)
  } catch (error) {
    console.error('Error updating support ticket:', error)
    return NextResponse.json({ error: 'Failed to update support ticket' }, { status: 500 })
  }
}

// DELETE - Delete a support ticket
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.supportTicket.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Support ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting support ticket:', error)
    return NextResponse.json({ error: 'Failed to delete support ticket' }, { status: 500 })
  }
}
