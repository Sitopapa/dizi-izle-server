document.addEventListener('DOMContentLoaded', () => {
    const serverUrlInput = document.getElementById('serverUrl');
    const roomIdInput = document.getElementById('roomId');
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const statusDiv = document.getElementById('status');
    const connectionPanel = document.getElementById('connectionPanel');
    const controlPanel = document.getElementById('controlPanel');
    const currentRoomDisplay = document.getElementById('currentRoomDisplay');

    // Kayıtlı ayarları yükle
    chrome.storage.local.get(['serverUrl', 'roomId', 'isConnected'], (result) => {
        if (result.serverUrl) serverUrlInput.value = result.serverUrl;
        if (result.roomId) roomIdInput.value = result.roomId;

        if (result.isConnected) {
            showConnectedState(result.roomId);
        }
    });

    connectBtn.addEventListener('click', () => {
        const serverUrl = serverUrlInput.value;
        const roomId = roomIdInput.value;

        if (!roomId) {
            statusDiv.textContent = "Lütfen bir oda adı girin.";
            return;
        }

        statusDiv.textContent = "Bağlanılıyor...";

        // Background script'e bağlanma isteği gönder
        chrome.runtime.sendMessage({
            action: "connect",
            data: { serverUrl, roomId }
        }, (response) => {
            if (response && response.success) {
                showConnectedState(roomId);
            } else {
                statusDiv.textContent = "Bağlantı hatası: " + (response ? response.error : "Bilinmiyor");
            }
        });
    });

    disconnectBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "disconnect" }, () => {
            showDisconnectedState();
        });
    });

    function showConnectedState(roomId) {
        connectionPanel.classList.add('hidden');
        controlPanel.classList.remove('hidden');
        currentRoomDisplay.textContent = `Oda: ${roomId}`;
        statusDiv.textContent = "Senkronizasyon aktif.";
    }

    function showDisconnectedState() {
        controlPanel.classList.add('hidden');
        connectionPanel.classList.remove('hidden');
        statusDiv.textContent = "";
        // Storage temizlemiyoruz ki bir dahaki sefere hatırlasın
        chrome.storage.local.set({ isConnected: false });
    }
});
