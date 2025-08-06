'use client'

import { useSession } from 'next-auth/react'

const ImpersonationBanner = () => {
  // Since we moved the stop impersonation button to the header,
  // we can remove this banner component or keep it minimal
  // Return null to hide the banner completely
  return null
}

export default ImpersonationBanner