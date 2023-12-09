import React, { useState } from "react"

function AddTodo({ addTodo }) {
  const [caption, setCaption] = useState("")
  const [assignee, setAssignee] = useState("")
  const [due, setDue] = useState(new Date())
  const [tags, setTags] = useState("")

  function handleKeyPressEnter(event) {
    if (event.key === 'Enter') {
      helper()
    }
  }
  function handleBtnAdd(event) {
    event.preventDefault()
    helper()
  }
  function helper() {
    addTodo({ caption, assignee, due, tags })
    setCaption("")
    setAssignee("")
    setDue("")
    setTags("")
  }

  return (
    <div
      className="d-block text-right card-footer d-flex"
      style={{ padding: "0.75rem" }}
    >
      <div className=" position-relative col " style={{ paddingLeft: "13px" }}>
        <input style={{ marginBottom: "6px" }} type="text"
          className="form-control input-todo" value={caption}
          onChange={(e) => {
            setCaption(e.target.value)
          }}
          onKeyPress={event => handleKeyPressEnter(event)}
          placeholder="Enter new todo"
        />
        <input style={{ marginBottom: "6px" }} type="text"
          className="form-control input-todo" value={assignee}
          onChange={(e) => {
            setAssignee(e.target.value)
          }}
          onKeyPress={event => handleKeyPressEnter(event)}
          placeholder="No assignee"
        />
        <input style={{ marginBottom: "6px" }} type="date"
          className="form-control input-todo" value={due}
          onChange={(e) => {
            setDue(e.target.value)
          }}
          onKeyPress={event => handleKeyPressEnter(event)}
        />
        <input style={{ marginBottom: "6px" }} type="text"
          className="form-control input-todo" value={tags}
          onChange={(e) => {
            setTags(e.target.value)
          }}
          onKeyPress={event => handleKeyPressEnter(event)}
          placeholder="Use ',' to seperate tags"
        />

        <div className="ml-auto" style={{ marginTop: "15px" }}>
          <button style={{ marginRight: "10px" }} type="button"
            className="border-0 btn-transition btn btn-outline-danger"
            onClick={e => {
              e.preventDefault()
              setCaption("")
              setAssignee("")
              setDue("")
            }}
          > Clear </button>
          <button type="button"
            className="border-0 btn-transition btn btn-outline-danger"
            onClick={e => handleBtnAdd(e)}
          > Add Task </button>
        </div>
      </div>
    </div>
  )
}

export default AddTodo
