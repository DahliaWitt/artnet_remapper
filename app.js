import * as dmxlib from "dmxnet";

console.log("lets go1!1");

// SUBNET REMAPPING
// SEPARATE ISSUE: UNIVERSE REMAPPING

// universe 1-32 remap to 0-15 subnet

// const SENDER_SUBNETS = 4;
const SENDER_UNIVERSES = 24;

const RECIEVER_UNIVERSES = 24;

const SENDER_PORT = 6454;

const DESTINATION_IP = "192.168.2.135";

const dmxnet = new dmxlib.dmxnet({
  log: { level: "info" }, // Winston logger options
  oem: 0, // OEM Code from artisticlicense, default to dmxnet OEM.
  esta: 0, // ESTA Manufacturer ID from https://tsp.esta.org, default to ESTA/PLASA (0x0000)
  sName: "Degenerprises Virtual Remapper", // 17 char long node description, default to "dmxnet"
  lName: "estrogen", // 63 char long node description, default to "dmxnet - OpenSource ArtNet Transceiver"
  hosts: ["0.0.0.0"], // Interfaces to listen to, all by default
  errFunc: function (err) {
    this.error(
      `Do some error handling or throw it: ${err.message}, stack: ${err.stack}`
    );
  }.bind(this), // optional function to handle errors from the library by yourself. If omitted the errors will be thrown by the library
});

function onRecieveArtnet(universe, data) {
  // if (!senderMap)
  // console.log("recieved artnet", universe, data);
  // if (universe < 16) {
  //   // send to to the original universe
  // }
  const sender = senderMap[universe];
  for (let i = 0; i < data.length; i++) {
    sender.prepChannel(i, data[i]);
  }
  sender.transmit();
  console.log("transmit!");
}

const recieverUniverseMap = {};

for (let i = 0; i < 16; i++) {
  recieverUniverseMap[i] = dmxnet.newReceiver({
    subnet: 0, //Destination subnet, default 0
    universe: i, //Destination universe, default 0
    net: 0, //Destination net, default 0
  });
  recieverUniverseMap[i].on("data", (data) => {
    // console.log("recieved artnet", i, data);
    onRecieveArtnet(i, data);
  });
  console.log("reciever registered for uni", i);
}
// second set of recievers
for (let i = 16; i < 24; i++) {
  recieverUniverseMap[i] = dmxnet.newReceiver({
    subnet: 1, //Destination subnet, default 0
    universe: i - 16, //Destination universe, default 0
    net: 0, //Destination net, default 0
  });
  recieverUniverseMap[i].on("data", (data) => {
    // console.log("recieved artnet", i, data);
    onRecieveArtnet(i, data);
  });
  console.log("reciever registered for uni", i);
}

// map from subnet (int) to map (universe int) to sender obj
// {
// 0: {0: object, 1: object}
//}
// const senderSubnetMap = {};

// // init the subnets
// for (let i = 0; i < SENDER_SUBNETS.length; i++) {
//   if (!senderSubnetMap[i]) {
//     senderSubnetMap[i] = {};
//   }

//   for (let j = 0; j < SENDER_UNIVERSE_PER_SUBNET; j++) {
//     senderSubnetMap[i][j] = dmxnet.newSender({
//       ip: DESTINATION_IP, //IP to send to, default 255.255.255.255
//       subnet: i, //Destination subnet, default 0
//       universe: j, //Destination universe, default 0
//       net: 0, //Destination net, default 0
//       port: SENDER_PORT, //Destination UDP Port, default 6454
//       base_refresh_interval: 1000, // Default interval for sending unchanged ArtDmx
//     });
//   }
// }

const senderMap = {};
for (let i = 0; i < SENDER_UNIVERSES; i++) {
  senderMap[i] = dmxnet.newSender({
    ip: DESTINATION_IP, //IP to send to, default 255.255.255.255
    subnet: 0, //Destination subnet, default 0
    universe: i + 1, //Destination universe, default 0
    net: 0, //Destination net, default 0
    port: SENDER_PORT, //Destination UDP Port, default 6454
    base_refresh_interval: 1000, // Default interval for sending unchanged ArtDmx
  });
}
