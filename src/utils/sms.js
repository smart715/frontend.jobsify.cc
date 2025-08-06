
const twilio = require('twilio')

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })
    
    console.log(`SMS sent successfully to ${to}, SID: ${result.sid}`)
    return { success: true, sid: result.sid }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { success: false, error: error.message }
  }
}

export function generateSMSCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // If it doesn't start with +, assume it's a US number
  if (!cleaned.startsWith('+')) {
    return `+1${cleaned}`
  }
  
  return cleaned
}
