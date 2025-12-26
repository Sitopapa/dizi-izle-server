const { io } = require("socket.io-client");

const socket1 = io("http://localhost:3000");
const socket2 = io("http://localhost:3000");
const ROOM = "test_room";

console.log("Test başlatılıyor...");

socket1.on("connect", () => {
    console.log("Client 1 bağlandı.");
    socket1.emit("join_room", ROOM);
});

socket2.on("connect", () => {
    console.log("Client 2 bağlandı.");
    socket2.emit("join_room", ROOM);

    // Her ikisi de bağlandıktan kısa süre sonra Client 1 bir 'play' olayı göndersin
    setTimeout(() => {
        console.log("Client 1 'play' olayı gönderiyor...");
        socket1.emit("sync_event", {
            roomId: ROOM,
            type: "play",
            currentTime: 10,
            timestamp: Date.now()
        });
    }, 1000);
});

socket2.on("sync_event", (data) => {
    console.log("Client 2 olay aldı:", data);
    if (data.type === "play" && data.currentTime === 10) {
        console.log("Test BAŞARILI: Mesaj iletildi.");
        process.exit(0);
    } else {
        console.log("Test BAŞARISIZ: Yanlış veri.");
        process.exit(1);
    }
});

setTimeout(() => {
    console.log("Test zaman aşımı.");
    process.exit(1);
}, 5000);
