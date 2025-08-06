
import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation'

import AddClient from '@views/clients/add'
import { authOptions } from '@/libs/auth'

const AddClientPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <AddClient />
}

export default AddClientPage
