let videoElement = null;
let isRemoteEvent = false;

// Sayfadaki videoyu bulmaya çalış
function findVideo() {
    const videos = document.getElementsByTagName('video');
    if (videos.length > 0) {
        videoElement = videos[0]; // İlk videoyu al
        setupVideoListeners();
        console.log("Video element bulundu ve dinleniyor.");
    } else {
        // Video hemen yüklenmeyebilir, DOM değişimlerini izle
        const observer = new MutationObserver((mutations) => {
            const vids = document.getElementsByTagName('video');
            if (vids.length > 0) {
                videoElement = vids[0];
                setupVideoListeners();
                observer.disconnect();
                console.log("Video element sonradan bulundu.");
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function setupVideoListeners() {
    if (!videoElement) return;

    ['play', 'pause', 'seeked'].forEach(eventType => {
        videoElement.addEventListener(eventType, (e) => {
            if (isRemoteEvent) return; // Uzaktan gelen komutsa sunucuya geri gönderme

            // Seek olayı çok sık tetiklenebilir, sadece kullanıcı elle yaptığında önemli
            // Ancak HTML5 video eventlerinde 'seeking' ve 'seeked' var. 'seeked' işlem bitince tetiklenir.

            const eventData = {
                type: eventType,
                currentTime: videoElement.currentTime,
                timestamp: Date.now()
            };

            console.log("Local event:", eventType);
            chrome.runtime.sendMessage({
                action: "videoEvent",
                data: eventData
            });
        });
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "applyVideoEvent") {
        if (!videoElement) {
            findVideo(); // Hala bulunamadıysa bir daha dene
            if (!videoElement) return;
        }

        const { type, currentTime } = request.data;
        console.log("Remote event received:", type, currentTime);

        isRemoteEvent = true;

        // Zaman senkronizasyonu (eğer fark büyükse)
        if (Math.abs(videoElement.currentTime - currentTime) > 0.5) {
            videoElement.currentTime = currentTime;
        }

        if (type === 'play') {
            videoElement.play().catch(e => console.log("Oynatma hatası:", e));
        } else if (type === 'pause') {
            videoElement.pause();
        }

        // Event listener'ların tetiklenmesini engellemek için kısa bir süre bekle
        setTimeout(() => {
            isRemoteEvent = false;
        }, 500);
    }
});

// Sayfa yüklendiğinde videoyu ara
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', findVideo);
} else {
    findVideo();
}
