import { Server } from 'socket.io'
import Redis from 'ioredis'
import * as dotenv from 'dotenv';
dotenv.config();

const Host = process.env.HOST;
const Port = process.env.PORT ? parseInt(process.env.PORT, 10) : undefined; // Convert PORT to a number
const Username = process.env.USERNAME;
const Password = process.env.PASSWORD;
console.log("----------------------",Host, Port, Username, Password);

// import config from 'process.env'
const pub = new Redis({
  host: Host,
  port: Port,
  username: Username,
  password: Password,
});

const sub = new Redis({
  host: Host,
  port: Port,
  username: Username,
  password: Password,
});

class SocketService {
    private _io: Server;  // instance variable of our class

    constructor() {
        console.log("Init Socket Service...");
        this._io = new Server({
          cors: {
            allowedHeaders: ["*"],
            // methods: ["GET", "POST"],
            origin: "*",
          },
        });
        sub.subscribe("MESSAGES");
      }

    public initListeners() {
        const io = this.io;
        io.on('connect', (socket) => {
            console.log(`new socket connected`, socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log('New Message Received', message)
                // Publish this message to redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            })
        })
        sub.on("message", async (channel, message) => {
          if (channel === "MESSAGES") {
            console.log("new message from redis", message);
            io.emit("message", message);
            // await produceMessage(message);
            // console.log("Message Produced to Kafka Broker");
          }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;