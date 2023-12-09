import React from "react"
import { useDoc } from "@syncstate/react"

function TodoItem({ todoItemPath }) {
  const [todos, setTodos] = useDoc("/todos", Infinity)
  const [todoItem, setTodoItem] = useDoc(todoItemPath)

  const deleteTodo = (id) => {
    let index
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === id) {
        index = i
        break
      }
    }
    setTodos((todos) => {
      todos.splice(index, 1)
    })
  }
  const toggleTodo = (completed) => {
    setTodoItem((todoItem) => {
      todoItem.completed = completed
    })
  }

  const rename = (name) => {
    setTodoItem(todoItem => {
      todoItem.caption = name
    })
  }

  const reassign = (name) => {
    setTodoItem(todoItem => {
      todoItem.assignee = name
    })
  }

  const reschedule = (date) => {
    setTodoItem(todoItem => {
      todoItem.due = date
    })
  }

  const changetags = (tags) => {
    setTodoItem(todoItem => {
      todoItem.tags = tags.split(',')
    })
  }

  const getTxtStyle = {
    textDecoration: todoItem.completed ? "line-through" : "none",
    marginLeft: "10px",
  }

  return (
    <div>
      <div className="d-flex align-content-center">
        <div
          className="custom-checkbox custom-control d-flex align-items-center"
          style={{ marginBottom: "2px" }}
        >
          <input
            type="checkbox"
            className="form-check-input"
            checked={todoItem.completed}
            onChange={(e) => {
              toggleTodo(e.target.checked)
            }}
          />
        </div>

        <div
          className="d-flex align-items-center todoTitle"
          style={getTxtStyle}
        >
          <input style={{ width: "40%", border: "none", textDecoration: todoItem.completed ? "line-through" : "" }}
            type="text" value={todoItem.caption} onChange={e => rename(e.target.value)} />
          <input style={{ fontSize: "14px", width: "20%", border: "none", color: "gray", borderRadius: "20px", paddingLeft: "5px", marginRight: "5px" }}
            type="text" value={todoItem.assignee} placeholder="No assignee" onChange={e => reassign(e.target.value)} />
          <input style={{ fontSize: "14px", width: "20%", border: "none", textDecoration: "", color: "gray", borderRadius: "20px", paddingLeft: "5px", marginRight: "5px" }}
            type="date" value={todoItem.due} onChange={e => reschedule(e.target.value)} />
          <input style={{ fontSize: "14px", width: "20%", border: "none", color: "gray", borderRadius: "20px", paddingLeft: "5px", marginRight: "5px" }}
            type="text" value={todoItem.tags} placeholder="Enter new tag" onChange={e => changetags(e.target.value)} />
        </div>
        <div className="ml-auto d-flex align-items-center">
          <button
            className="border-0 btn-transition btn btn-outline-danger"
            onClick={() => { deleteTodo(todoItem.id) }}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoItem
