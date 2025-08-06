// Next Imports
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import DesignationList from '@/views/hr/designation/list'

const DesignationListPage = async ({ params }) => {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return <DesignationList dictionary={dictionary} />
}

export default DesignationListPage