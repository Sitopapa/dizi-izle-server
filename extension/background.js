import './socket.io.min.js';

let socket = null;
let currentRoom = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "connect") {
        connectToSocket(request.data.serverUrl, request.data.roomId, sendResponse);
        return true; // Asenkron response için gerekli
    } else if (request.action === "disconnect") {
        disconnectSocket();
        sendResponse({ success: true });
    } else if (request.action === "videoEvent") {
        if (socket && socket.connected) {
            // Content script'ten gelen video olayını sunucuya ilet
            socket.emit('sync_event', {
                roomId: currentRoom,
                ...request.data
            });
        }
    }
});

function connectToSocket(url, roomId, sendResponse) {
    if (socket && socket.connected) {
        socket.disconnect();
    }

    try {
        socket = io(url, {
            reconnection: true,
            reconnectionAttempts: 5,
            extraHeaders: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        socket.on('connect', () => {
            console.log('Sunucuya bağlandı');
            currentRoom = roomId;
            socket.emit('join_room', roomId);

            // Bağlantı durumunu kaydet
            chrome.storage.local.set({
                serverUrl: url,
                roomId: roomId,
                isConnected: true
            });

            sendResponse({ success: true });
        });

        socket.on('connect_error', (error) => {
            console.error('Bağlantı hatası:', error);
            sendResponse({ success: false, error: error.message });
        });

        socket.on('sync_event', (data) => {
            // Sunucudan gelen olayı aktif sekmeye gönder
            sendEventToActiveTab(data);
        });

    } catch (e) {
        sendResponse({ success: false, error: e.message });
    }
}

function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    currentRoom = null;
    chrome.storage.local.set({ isConnected: false });
}

function sendEventToActiveTab(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "applyVideoEvent",
                data: data
            });
        }
    });
}
