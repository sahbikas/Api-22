const http = require('http');

const server = http.createServer()

server.listen(3000, 'localhost', (err) => {
    if(!err) {
        console.log("Server is running on Port: 3000")
        console.log("Browse http://localhost:3000 for server")
        console.log("Press CTRS+C to end/disconnect tht server")
    }
})