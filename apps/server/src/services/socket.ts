import { Server } from 'socket.io'
import Redis from 'ioredis'
const pub = new Redis({
  host: "redis-2f076575-graceunstoppable7-e120.a.aivencloud.com",
  port: 13236,
  username: "default",
  password: "AVNS_4WuXBm75Dm7V-yrpfVy",
});

const sub = new Redis({
  host: "redis-2f076575-graceunstoppable7-e120.a.aivencloud.com",
  port: 13236,
  username: "default",
  password: "AVNS_4WuXBm75Dm7V-yrpfVy",
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