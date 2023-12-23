import { useEffect, useState } from "react"
import TaskListItem from "./TaskListItem"


export default function TaskList({ tasks, removeTask, editTask, doneTask }) {
  const [priority, setPriority] = useState(false)
  const [filteredTasks, setFilteredTask] = useState(tasks)

  function handlePriorityFilter() {
    const newPriority = !priority
    newPriority ? setFilteredTask(tasks.filter(item => item.priority === newPriority)) : setFilteredTask(tasks)
    setPriority(newPriority)
  }

  useEffect(() => {
    setFilteredTask(tasks)
  }, [tasks])

  if (tasks.length === 0) {
    return <>
    <div> 
      <span className="btn btn-danger mb-3">Görev Eklenmedi</span>
    </div>
    </>
  }

  return (
    <>
      <div className="p-4 bg-light mb-5 border rounded">
        <h4 className="mb-3">Gorevler:
          <button onClick={handlePriorityFilter}
            className={`btn btn-sm ${!priority ? "btn-info" : "btn-primary"} float-end`}>
            {!priority ? "Oncelikli Olanlari Goster" : "Hepsini Goster.."}
          </button>
        </h4>
        <ul className="list-group">
          {filteredTasks.map(
            (task) =>
              <TaskListItem
                key={task.id}
                task={task}
                editTask={editTask}
                removeTask={removeTask}
                doneTask={doneTask}
              />
          )}
        </ul>
      </div>
    </>
  )
}