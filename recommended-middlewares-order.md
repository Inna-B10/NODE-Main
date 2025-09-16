```js
//* Custom middleware
app.use(logger)

//* Third-party middleware
app.use(cors(corsOptions))

//* Built-in middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

//* Routes
app.get(...)

//* 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'view', '404.html'))
})

//* Error handler (last!)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err.message)
})
```
