import { Server } from 'socket.io';
import mongoose  from 'mongoose';

mongoose.connect("mongodb+srv://Abhinav:abhinav123@nodejsproject.pwxex.mongodb.net/googledocsclone?retryWrites=true&w=majority", async (err) => {
    if (err)
    throw err;
    console.log("Connected to MongoDB!");
});

import { getDocument,updateDocument } from './controller.js';


const PORT = process.env.PORT || 4000;

const io = new Server(PORT,{
    cors:{
        // origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

io.on("connection",socket => {
    console.log("Connected!!");
    socket.on("get-document",async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document",document.data);
        
        socket.on('send-changes',delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
})