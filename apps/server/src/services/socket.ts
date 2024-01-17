import { Server } from 'socket.io'

class SocketService {
    private _io: Server;  // instance variable of our class
    constructor() {
        console.log("Init Socket Service...");
        this._io = new Server({
          cors: {
            allowedHeaders: ["*"],
            methods: ["GET", "POST"],
            origin: "*",
          },
        });
      }

    public initListeners() {
        const io = this.io;
        io.on('connect', (socket) => {
            console.log(`new socket connected`, socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log('New Message Rec', message)
            })
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;