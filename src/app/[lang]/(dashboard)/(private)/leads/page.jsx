
import { getDictionary } from '@/utils/getDictionary'
import LeadsList from '@/views/leads/list'

const LeadsPage = async ({ params }) => {
  const dictionary = await getDictionary(params.lang)

  return <LeadsList dictionary={dictionary} />
}

export default LeadsPage
