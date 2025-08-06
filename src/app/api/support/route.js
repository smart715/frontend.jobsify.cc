
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all support tickets
export async function GET() {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the data for the frontend
    const formattedTickets = tickets.map(ticket => ({
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
    }))

    return NextResponse.json(formattedTickets)
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 })
  }
}

// POST - Create a new support ticket
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.ticketSubject || !body.description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 })
    }

    // Generate ticket number
    const ticketCount = await prisma.supportTicket.count()
    const ticketNumber = `#TKT-${String(ticketCount + 1).padStart(6, '0')}`

    // Create new ticket in database
    const newTicket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        subject: body.ticketSubject,
        description: body.description,
        requesterName: body.requesterName || 'Unknown',
        requesterEmail: body.requesterEmail,
        companyId: body.companyId,
        companyName: body.requestedForCompany,
        priority: body.priority || 'Medium',
        category: body.category || 'General',
        attachments: body.attachments || null,
        status: 'Open'
      }
    })

    // Format response
    const formattedTicket = {
      id: newTicket.id,
      ticketNumber: newTicket.ticketNumber,
      subject: newTicket.subject,
      description: newTicket.description,
      requesterName: newTicket.requesterName,
      requesterEmail: newTicket.requesterEmail,
      requestedOn: newTicket.createdAt.toISOString().split('T')[0],
      status: newTicket.status,
      priority: newTicket.priority,
      category: newTicket.category,
      companyId: newTicket.companyId,
      companyName: newTicket.companyName,
      createdAt: newTicket.createdAt,
      updatedAt: newTicket.updatedAt
    }

    return NextResponse.json(formattedTicket, { status: 201 })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 })
  }
}
