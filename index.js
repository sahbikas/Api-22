const http = require("http");
const app = require("./src/config/express.config")

const {Server} = require("socket.io")
const productSvc = require('./src/app/product/product.service')

const server = http.createServer(app);
const io = new Server(server, {
    cors: "*"
})
io.on('connection', (socket) => {
    console.log("A new client is connected...")

    io.on("newOrder", (data) => {
        let sellerId = data.sellerId;
        io.emit("placedOrdere", {sellerId: sellerId, msg: "New Order Placed."})
    })
    io.on("productView", async (data) => {
        try{
            await productSvc.increaseCount(data.productId);
        }catch(exception){
            throw exception;
        }
    })
    io.on("blockProduct", async(data) => {
        const {productId, qty} = data;
    })
})
server.listen(3000, 'localhost', (err) => {
    if(!err) {
        console.log("Server is running on port 3000")
        console.log("Browse http://localhost:3000 for server")
        console.log("Press CTRL+C to end server")
    }
})

