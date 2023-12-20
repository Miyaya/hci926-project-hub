import React, { useState, useEffect } from 'react'
import './App.css'
import TodoItem from './components/TodoItem'
import AddTodo from './components/AddTodo'
import { useDoc } from '@syncstate/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login.js'

function App({ socket }) {
  const todoPath = '/todos'
  const usersPath = '/users'
  const [todos, setTodos] = useDoc(todoPath)
  const [users, setUsers] = useDoc(usersPath)
  const [username, setUsername] = useState("")

  useEffect(() => {
    socket.on('userLoggedIn', (obj) => {
      console.log(obj.username)
      setUsername(obj.username)
    })

    socket.on('addUserList', (obj) => {
      setUsers((users) => {
        users.push(obj.username)
      })
      console.log(obj.username, users)
    })

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect()
    }
  }, [])


  //generate unique id
  const keyGenerator = () => "_" + Math.random().toString(36).substr(2, 9)
  const addTodo = (todoItem) => {
    setTodos((todos) => {
      let id = keyGenerator()
      todos.push({
        id: id,
        caption: todoItem.caption,
        assignee: todoItem.assignee,
        completed: false,
        due: todoItem.due
      })
      document.getElementsByClassName("input-todo")[0].value = ""
    })
  }

  const todoList = todos.map((todoItem, index) => {
    return (
      <li key={todoItem.index} className="list-group-item">
        <TodoItem todo={todoItem} todoItemPath={todoPath + "/" + index} />
      </li>
    )
  })

  const userSet = Array.from(new Set(users))
  const userList = userSet.map((user, index) => {
    return (
      <li key={user.index} className="list-group-item">
        {user}
      </li>
    )
  })

  return (
    <div className="container mt-5">
      <h2 className="text-center text-white">
        Welcome to Project Hub!
      </h2>

      <Router>
        <div>

          {username ? (
            <>
              <p>Logged in as: {username}</p>

              <div className="row justify-content-center mt-5">
                <div className="col-md-3">
                  <div className="overflow-auto" style={{ height: "auto", maxHeight: "300px" }}>
                    <div className="position-static">
                      <ul className=" list-group list-group-flush">{userList}</ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card-hover-shadow-2x mb-3 card">
                    <div className="card-header-tab card-header">
                      <div className="card-header-title font-size-lg text-capitalize font-weight-normal">
                        <i className="fa fa-tasks"></i>&nbsp;Task Lists
                      </div>
                    </div>
                    <div className="overflow-auto" style={{ height: "auto", maxHeight: "300px" }}>
                      <div className="position-static">
                        <ul className=" list-group list-group-flush">{todoList}</ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <AddTodo addTodo={addTodo} />
                </div>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="login-btn">Login</a>
              <Routes>
                <Route path="/login" element={<Login socket={socket} />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </div>
  );
}

export default App
