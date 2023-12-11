# hci926-project-hub
collaborative project and task management platform

## Execution
### client side
```
npm i
npm run start
```
### server side
```
cd server
node index.js
```

## Some take-away for me
1. Server-side rendered can't handle peer-to-peer collaborative behaviors; client-side rendered can't store data in persistence.

## Reference
### Collaborative Hierarchical Todo
In this example, you can see there's hierarchy in todos
[Serverless Collaborative Hierarchical TODO App in 200 LoC](https://mlajtos.mu/posts/serverless-collaborative-hierarchical-todo-app-in-200-loc) by Milan Lajtoš

### MongoDB provider for y.js
y.js provide serverless, client-side update; mongodb stores the persistent data
[Mongodb database adapter for Yjs](https://github.com/MaxNoetzold/y-mongodb-provider)

### Multi-User Todo
Complete project with good looking UI and a server
[SyncState](https://github.com/syncstate/multi-user-todo-example)

### Authentication
cookie based authentication with username and password
[Next.js with-passport](https://github.com/vercel/next.js/tree/canary/examples/with-passport)

todo web app using express and password
[todos-express-password](https://github.com/passport/todos-express-password)

## Good-to-know
### Conflict-free Replicated Data Type (CRDTs)
[About CRDTs](https://crdt.tech/)

### SyncState
[Official Document](https://syncstate.geekyants.com/docs/getting-started)
> SyncState is a document-based state management library for React and JS apps.
> In a SyncState store, all your data is contained in a single document. SyncState is based on JSON patches and uses these patches to update the document.
> While SyncState can very well be used as a general purpose state management solution, we created it to make it easy to build realtime multi-user, undoable apps.