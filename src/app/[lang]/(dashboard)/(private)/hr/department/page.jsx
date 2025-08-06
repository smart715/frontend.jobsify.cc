
// Next Imports
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import DepartmentList from '@/views/hr/department/list'

const DepartmentPage = async ({ params }) => {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return <DepartmentList dictionary={dictionary} />
}

export default DepartmentPage
