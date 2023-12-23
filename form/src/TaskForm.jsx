import { useEffect, useState } from "react"
import {v4 as uuidv4} from 'uuid';
import TaskList from "./TaskList"

export default function TaskForm() {
  const emptyForm = {task: "", priority: false, isDone: false}
  const [formData, setFormData ] = useState(emptyForm)
  const [tasks, setTasks] = useState([]) 
  const [taskChangeCount, setTaskChangeCount] = useState(0)  

   useEffect(() => {
    const localStorageTasks = JSON.parse(localStorage.getItem("tasks"))
    setTasks(localStorageTasks ?? [])
  }, [])

  
  useEffect(() => {
    if (taskChangeCount > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [taskChangeCount])

  function doneTask(id) {
    const taskIndex = tasks.findIndex(item => item.id === id)
    const task = tasks[taskIndex]
    task.isDone = !task.isDone
    const newTasks = tasks.slice()
    newTasks[taskIndex] = task
    setTasks(newTasks)
    setTaskChangeCount(prev => prev + 1)
  }

  function editTask(id) {
    const task = tasks.find(item => item.id === id)
    setFormData({...task, isEdited: true })
    setTaskChangeCount(prev => prev + 1)
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(item => item.id !== id))
    setTaskChangeCount(prev => prev + 1)
  }

  function handleInputChange(event) {
    setFormData(prev => {
      return {
        ...prev,
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
      }
    })
    
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    if (formData.isEdited) {
      const taskIndex = tasks.findIndex(item => item.id === formData.id)
      const newTasks = tasks.slice()
      newTasks[taskIndex] = {...formData}
      setTasks(newTasks)
    }
    else if (formData.task.length >= 3) {
      formData.id = uuidv4()
      setTasks(
        prev => 
        [formData, ...prev]
      )
    }
    setTaskChangeCount(prev => prev + 1)
    setFormData(emptyForm)
    event.target.reset()
  }

  return (
    <>
      <TaskList tasks={tasks} removeTask={removeTask} editTask={editTask} doneTask={doneTask} />

      <form onSubmit={handleFormSubmit}>
        <div className="row mb-3">
          <label htmlFor="task" className="col-sm-2 col-form-label">Task</label>
          <div className="col-sm-10">
            <input 
              type="text" className="form-control" 
              id="task" name="task" 
              value={formData.task}
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input 

                className="form-check-input" 
                type="checkbox" id="priority" name="priority"  
                checked={formData.priority}
                onChange={handleInputChange} 
              />
                <label className="form-check-label" htmlFor="priority" >
                  Oncelikli
                </label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Kaydet</button>
      </form>
    </>
  )
}