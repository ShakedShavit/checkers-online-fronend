import openSocket, { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
// const socket = io('http://host.docker.internal:5000');

export const searchRankedMatch = () => {
    
}
socket.on('onlineUsersCounter', (counter) => {
    console.log(counter);
})

// socket.emit - sending event to single connection
// socket.on - receiving event
// io.on - listening to events
// io.emit - sending event to every connection
// socket.join('room name'); // joins connection to room (there is also leave instead of join to do the opposite)
// io.to('room name').emit - sending event to a single room
// socket.broadcast.to('room name').emit - sending event to everyone in the room except the single connection
// socket.broadcast.emit - sending event except the connection it refers to
// event acknowledgment - in the emit adding a function, in the on add callback (acknowledgment that the event was sent successfully)