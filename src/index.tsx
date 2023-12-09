import { v4 as uuid } from "uuid"
import { useCallback, useState, useEffect } from "react"
import { render } from "react-dom"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import { proxy, useSnapshot } from "valtio"
import { bindProxyAndYMap } from "valtio-yjs"

type ITask = {
    id: string
    title: string
    done: boolean
    assignee: string
    dueday: string
    subtasks: ITask[]
    tags: string[]
}

const ydoc = new Y.Doc()
const ymap = ydoc.getMap("mymap")

new WebsocketProvider(
    "wss://demos.yjs.dev",
    "project-hub",
    ydoc
)

const state = proxy({
    todoRoot: {
        id: uuid(),
        title: "Dominate the World",
        done: false,
        assignee: "",
        dueday: new Date(2024, 0, 1).toString(),
        tags: [],
        subtasks: []
    }
})

bindProxyAndYMap(state, ymap)

function findTask(id: string, task: ITask = state.todoRoot): ITask {
    if (task.id === id) {
        return task
    }

    const candidates = task.subtasks
        .map((subtask) => findTask(id, subtask))
        .filter(Boolean)
        .flat(Infinity)

    return candidates?.[0] ?? undefined
}

const Task = ({ id, done, title, assignee, dueday, subtasks, tags }: ITask) => {
    const [localTitle, setLocalTitle] = useState(title)
    useEffect(() => setLocalTitle(title), [title])

    const onToggle = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const todo = findTask(id)
            todo.done = e.target.checked
        },
        [id]
    )

    const onRename = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const todo = findTask(id)
            todo.title = e.target.value
            setLocalTitle(e.target.value)
        },
        [id]
    )

    const onAdd = useCallback(() => {
        const todo = findTask(id)
        todo.subtasks.push({
            id: uuid(),
            title: "New Task",
            done: false,
            assignee: "",
            dueday: new Date(2024, 0, 1).toString(),
            tags: [],
            subtasks: []
        })
    }, [id])

    const onAssign = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const todo = findTask(id)
            todo.assignee = e.target.value
        },
        [id]
    )

    const onPickDate = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const todo = findTask(id)
            todo.dueday = e.target.value.toString()
        },
        [id]
    )

    const onAddTag = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const todo = findTask(id)
            todo.tags = e.target.value.split(",")
        }, [id])

    return (
        <div>
            <div>
                <input type="checkbox" checked={done} onChange={onToggle} />
                <input
                    type="text"
                    value={localTitle}
                    onInput={onRename}
                    style={{
                        textDecoration: done ? "line-through" : "",
                        width: "20em",
                        border: "none"
                    }}
                />
                <input type="text" value={assignee == "" ? "no assignee" : assignee}
                    onInput={onAssign} style={{ color: "gray", border: "none" }} />
                <input type="date" id="dueday" onInput={onPickDate} name="dueday" value={dueday} min="2018-01-01" max="2025-12-31" />
                <input type="text" value={tags}
                    onInput={onAddTag} style={{ color: "gray", border: "none" }} />

                <button onClick={onAdd}>+</button>
            </div>
            <div style={{ paddingLeft: "1em" }}>
                {subtasks.map((task) => (
                    <Task key={task.id} {...task} />
                ))}
            </div>
        </div>
    );
};

export default function App() {
    const stateSnapshot = useSnapshot(state)

    return (
        <div style={{ fontFamily: "sans-serif" }}>
            <div>
                <h1>Welcome to Project Hub</h1>
                <h4>Collaboratively finish project ;-)</h4>
                <Task {...stateSnapshot.todoRoot} />
            </div>
            <hr />
            <pre>{JSON.stringify(stateSnapshot, null, 2)}</pre>
        </div>
    )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
