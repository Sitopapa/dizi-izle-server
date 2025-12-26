# Sunucuyu Kalıcı Olarak İnternete Açma (Render.com ile Ücretsiz)

Arkadaşınızla her zaman sorunsuz bağlanmak için sunucuyu kendi bilgisayarınız yerine buluta yüklemeniz en iyisidir. Render.com bunu ücretsiz sağlar.

## Adım Adım Kurulum

1.  **GitHub'a Yükleme**
    *   `server` klasöründeki dosyaları (`index.js`, `package.json`, `package-lock.json`) yeni bir GitHub deposuna (repository) yükleyin.
    *   Veya bu dosyaları bir Gist olarak da kaydedebilirsiniz ama repo daha iyidir.

2.  **Render Hesabı Açın**
    *   [Render.com](https://render.com) adresine gidin ve GitHub hesabınızla giriş yapın.

3.  **Yeni Web Servisi Oluşturun**
    *   Dashboard'da **"New +"** butonuna tıklayın ve **"Web Service"** seçin.
    *   GitHub reponuzu bağlayın.
    *   Aşağıdaki ayarları yapın:
        *   **Name:** `dizi-izle-server` (veya istediğiniz bir isim)
        *   **Root Directory:** `server` (Burası çok önemli! Dosyalarınız server klasöründeyse buraya server yazmalısınız)
        *   **Environment:** `Node`
        *   **Build Command:** `npm install`
        *   **Start Command:** `node index.js`
        *   **Instance Type:** `Free`

4.  **Oluşturun ve URL'yi Alın**
    *   En alttaki **"Create Web Service"** butonuna basın.
    *   Render sunucunuzu kuracak ve size `https://dizi-izle-server-xxxx.onrender.com` gibi bir URL verecek.

5.  **Eklentide Kullanın**
    *   Bu yeni URL'yi hem siz hem de arkadaşınız eklentideki **Sunucu URL** kısmına yapıştırın.
    *   Artık bilgisayarınız kapalı olsa bile eklenti çalışacaktır!
