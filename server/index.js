const express = require('express')
const socket = require('socket.io')
const { v4: uuidv4 } = require('uuid')
const PatchManager = require('./PatchManager')
const { SyncStateRemote } = require('@syncstate/remote-server')
const remote = new SyncStateRemote()
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const server = app.listen(8000, function () {
  console.log('listening on port 8000')
})

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/login', (req, res) => {
  const { username } = req.body // parse username

  res.json({ success: true, message: `Welcome, ${username}!` })
})


const io = socket(server)
const projectId = uuidv4() //generate unique id

let patchManager = new PatchManager()

io.on('connection', async (socket) => {
  socket.on('fetchDoc', (path) => {
    //get all patches
    const patchesList = patchManager.getAllPatches(projectId, path)

    if (patchesList) {
      //send each patch to the client
      patchesList.forEach((change) => {
        socket.emit("change", path, change)
      })
    }
  })

  //patches recieved from the client
  socket.on('change', (path, change) => {
    change.origin = socket.id

    //resolves conflicts internally
    remote.processChange(socket.id, path, change)
  })

  const dispose = remote.onChangeReady(socket.id, (path, change) => {
    //store the patches in js runtime or a persistent storage
    patchManager.store(projectId, path, change)

    //broadcast the pathes to other clients
    socket.broadcast.emit('change', path, change)
  })
})
