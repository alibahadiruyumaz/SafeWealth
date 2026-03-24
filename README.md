SafeWealth: Cihaz Tabanlı Finansal Analitik ve Portföy Yönetimi

Geliştirici: Ali Bahadır Uyumaz (Öğrenci No: 22290875)
Danışman: Öğr. Gör. ENVER BAĞCI
Ders: BLM4538 - IOS İle Mobil Uygulama Geliştirme II

Proje Vizyonu
SafeWealth, heterojen finansal ekosistemlerde yer alan kullanıcı portföylerini tek bir asenkron arayüz üzerinden konsolide eden, React Native tabanlı bir iOS analitik platformudur. "Privacy-First" (Gizlilik Öncelikli) yaklaşımıyla, hassas finansal veriler bulut yerine cihaz üzerinde işlenmektedir.

---

Haftalık İlerleme Raporları

Haftalık İlerleme Raporları
---
Hafta 1 & 2: Gereksinim Analizi, UI Tasarımı ve Proje İskeleti

Hocam, bu hafta projenin Gereksinim Analizi, Figma Tasarımı ve Navigasyon İskeleti maddelerini tamamladım.

Figma üzerinde Dashboard ve Detay ekranlarının matematiksel koordinatlarla tasarımını bitirdim. Expo Managed Workflow ile projeyi ayağa kaldırdım ve React Navigation (Stack & Tab) kurulumu ile sayfalar arası geçiş mimarisini oturttum.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/EbYcll97KKY

Hafta 3: API Entegrasyonu ve Asenkron Hata Yönetimi

Hocam, bu hafta projenin dış veri akışını sağlamak amacıyla Axios ile CoinGecko REST API'sine asenkron bağlantı kurulumunu tamamladım. 

Basit bir API çağrısı yapmak yerine, projede belirttiğim mimari kararlara sadık kalarak `src/api/` klasörü altında merkezi bir Axios Instance (`axiosClient.js`) oluşturdum. API'den dönen JSON verisini "Interceptor" yapısıyla parse ettim ve HTTP asenkron hata yönetimini (Rate Limit, Network Error vb.) tek bir merkezden kontrol altına aldım. Kripto verilerini çekme işlemlerini ise `cryptoService.js` dosyasında izole ettim.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: [VİDEO 2 URL BURAYA GELECEK]
