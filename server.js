const express=require("express");
const app=express();
const { v4: uuidv4}= require("uuid");
const server=require("http").Server(app);
const io=require("socket.io")(server);
const {ExpressPeerServer}=require('peer');
const peerServer=ExpressPeerServer(server,{
  debug:true
});


app.set("view engine","ejs");
app.use(express.static("public"));
app.use('/peerjs',peerServer);

app.get("/",function(req,res){
  res.redirect("/${uuidv4()}");
});

app.get("/:room",function(req,res){
  res.render("room",{roomId: req.params.room});
})

io.on("connection",socket=>{
  socket.on("join-room",(roomId,userId)=>{
    socket.join(roomId);
    socket.to(roomId).emit("user-connected",userId);
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message);
    })
  })
})


const port=3000||process.env.PORT;

server.listen(port,function(){
  console.log("server is running");
});
