
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch finance settings from system settings
    const settings = await prisma.systemSettings.findMany({
      where: {
        key: {
          in: [
            'finance_invoice_logo',
            'finance_language',
            'finance_show_advanced_signatory',
            'finance_billing_name',
            'finance_tax_name',
            'finance_tax_id',
            'finance_billing_address',
            'finance_terms_conditions'
          ]
        }
      }
    })

    // Convert to key-value object
    const settingsObject = settings.reduce((acc, setting) => {
      const key = setting.key.replace('finance_', '')
      acc[key] = setting.value
      return acc
    }, {})

    // Convert boolean strings back to booleans
    if (settingsObject.show_advanced_signatory) {
      settingsObject.showAdvancedSignatory = settingsObject.show_advanced_signatory === 'true'
      delete settingsObject.show_advanced_signatory
    }

    // Convert snake_case to camelCase
    const camelCaseSettings = {
      invoiceLogo: settingsObject.invoice_logo || null,
      language: settingsObject.language || 'English',
      showAdvancedSignatory: settingsObject.showAdvancedSignatory || false,
      billingName: settingsObject.billing_name || '',
      taxName: settingsObject.tax_name || '',
      taxId: settingsObject.tax_id || '',
      billingAddress: settingsObject.billing_address || '',
      termsAndConditions: settingsObject.terms_conditions || 'Thank you for your business.'
    }

    return NextResponse.json({
      success: true,
      data: camelCaseSettings
    })
  } catch (error) {
    console.error('Error fetching finance settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch finance settings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    const language = formData.get('language')
    const showAdvancedSignatory = formData.get('showAdvancedSignatory')
    const billingName = formData.get('billingName')
    const taxName = formData.get('taxName')
    const taxId = formData.get('taxId')
    const billingAddress = formData.get('billingAddress')
    const termsAndConditions = formData.get('termsAndConditions')
    const invoiceLogo = formData.get('invoiceLogo')

    let logoPath = null

    // Handle file upload if present
    if (invoiceLogo && invoiceLogo instanceof File) {
      const bytes = await invoiceLogo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'finance')
      await mkdir(uploadsDir, { recursive: true })
      
      // Generate unique filename
      const filename = `invoice-logo-${Date.now()}.${invoiceLogo.name.split('.').pop()}`
      const filepath = path.join(uploadsDir, filename)
      
      // Save file
      await writeFile(filepath, buffer)
      logoPath = `/uploads/finance/${filename}`
    }

    // Settings to save/update
    const settingsToSave = [
      { key: 'finance_language', value: language || 'English' },
      { key: 'finance_show_advanced_signatory', value: showAdvancedSignatory || 'false' },
      { key: 'finance_billing_name', value: billingName || '' },
      { key: 'finance_tax_name', value: taxName || '' },
      { key: 'finance_tax_id', value: taxId || '' },
      { key: 'finance_billing_address', value: billingAddress || '' },
      { key: 'finance_terms_conditions', value: termsAndConditions || 'Thank you for your business.' }
    ]

    // Add logo path if uploaded
    if (logoPath) {
      settingsToSave.push({ key: 'finance_invoice_logo', value: logoPath })
    }

    // Use upsert to create or update each setting
    const updatePromises = settingsToSave.map(setting =>
      prisma.systemSettings.upsert({
        where: { key: setting.key },
        update: { 
          value: setting.value,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value
        }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Finance settings saved successfully'
    })
  } catch (error) {
    console.error('Error saving finance settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save finance settings' },
      { status: 500 }
    )
  }
}
