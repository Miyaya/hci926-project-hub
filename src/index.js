import React from "react"
import { createDocStore } from "@syncstate/core"
import { Provider } from "@syncstate/react"
import ReactDOM from "react-dom"
import App from "./App.js"
import "./index.css"
import io from "socket.io-client"
import reportWebVitals from "./reportWebVitals"
import * as remote from "@syncstate/remote-client"


const store = createDocStore({ todos: [], users: [] }, [remote.createInitializer()])

// enable remote plugin
store.dispatch(remote.enableRemote("/todos"))
store.dispatch(remote.enableRemote("/users"))

// setting up socket connection with the server
let socket = io.connect("http://192.168.1.18:8000")

// send request to server to get patches everytime when page reloads
socket.emit("fetchDoc", "/todos")
socket.emit("fetchDoc", "/users")

//observe the changes in store state
store.observe(
  "doc",
  "/todos",
  (todos, change) => {
    if (!change.origin) {
      //send json patch to the server
      socket.emit("change", "/todos", change)
    }
  },
  Infinity
)
store.observe(
  "doc",
  "/users",
  (users, change) => {
    console.log(users)
    console.log(change.patch.value)
    if (!users.includes(change.patch.value)) {
      socket.emit("change", "/users", change)
    }
  },
  1
)

//get patches from server and dispatch
socket.on("change", (path, patch) => {
  store.dispatch(remote.applyRemote(path, patch))
})

ReactDOM.render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById("root")
)

reportWebVitals()
