
import { getDictionary } from '@/utils/getDictionary'
import TodoList from '@/views/todos/TodoList'

const TodosPage = async ({ params }) => {
  const resolvedParams = await params
  const dictionary = await getDictionary(resolvedParams.lang)

  return <TodoList dictionary={dictionary} />
}

export default TodosPage
