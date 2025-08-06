
// Next Imports
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import HolidayList from '@/views/hr/holiday/list'

const HolidayListPage = async ({ params }) => {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return <HolidayList dictionary={dictionary} />
}

export default HolidayListPage
