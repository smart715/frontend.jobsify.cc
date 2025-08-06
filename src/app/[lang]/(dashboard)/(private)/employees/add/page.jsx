
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import AddEmployee from '@views/employees/add'
import { authOptions } from '@/libs/auth'

const AddEmployeePage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <AddEmployee />
}

export default AddEmployeePage
