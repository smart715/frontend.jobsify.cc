'use client'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import ClientView from '@views/clients/view'

const AccountTab = dynamic(() => import('@views/clients/view/account'))

// Vars
const tabContentList = () => ({
  account: <AccountTab />
})

const ViewClientPage = () => {
  return <ClientView tabContentList={tabContentList()} />
}

export default ViewClientPage