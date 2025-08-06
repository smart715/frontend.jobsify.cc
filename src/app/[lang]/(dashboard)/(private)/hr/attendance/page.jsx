
// Next Imports
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import AttendanceList from '@/views/hr/attendance/list'

const AttendancePage = async ({ params }) => {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return <AttendanceList dictionary={dictionary} />
}

export default AttendancePage
