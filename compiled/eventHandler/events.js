"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEvents = void 0;
const fs_1 = require("fs");
//loads all the events found in the events folder
function loadEvents(client) {
    try {
        //same as commands but for events
        const eventFiles = (0, fs_1.readdirSync)(__dirname + "/events").filter((file) => file.endsWith(".ts"));
        /* The Client class in discord.js extends the EventEmitter class.
    Therefore, the client object exposes the .on() and .once() methods that you can use to register event listeners.
    These methods take two arguments: the event name and a callback function.
         */
        for (const file of eventFiles) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const event = require(__dirname + `/events/${file}`).event;
            //registers the Events
            if (event.type === "once") {
                client.once(event.name, (interaction) => event.execute(interaction));
            }
            else if (event.type === "on") {
                client.on(event.name, (interaction) => event.execute(interaction));
            }
        }
    }
    catch (err) {
        console.error("Critical error caught in events.ts\n" + err);
    }
}
exports.loadEvents = loadEvents;
