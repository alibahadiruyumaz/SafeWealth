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

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/dcKz048SEzE

Hafta 4: Global State Yönetimi (Redux) ve Performans Optimizasyonu

Hocam, bu hafta API'den gelen verileri uygulamanın her noktasından tutarlı bir şekilde yönetebilmek için Redux Toolkit entegrasyonunu ve ana ekranın listeleme optimizasyonlarını tamamladım.

Uygulamanın asenkron durum yönetimini createAsyncThunk yapısıyla cryptoSlice.js içerisinde izole ettim. Arayüz tarafında ise cihaz RAM'ini korumak ve listeleme performansını artırmak (Virtualization) amacıyla FlatList üzerinde React.memo, windowSize ve initialNumToRender parametrelerini devreye aldım. Ayrıca API'den gelen eksik (null) veya çok küçük değerli (Shiba Inu vb.) varlıklar için "Safe Render" ve "Dinamik Fiyat Hassasiyeti" algoritmaları kurgulayarak uygulamanın Figma tasarımlarındaki profesyonel nizamda çalışmasını sağladım.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/UbhO8kb9GGw

Hafta 5: Detay Analiz Sayfası, Dinamik Grafik Entegrasyonu ve Favori Yönetimi

Hocam, bu hafta projenin kullanıcı etkileşimi ve veri görselleştirme katmanlarını kapsayan Detay Analiz Ekranı ve Redux Tabanlı Favori (Watchlist) Sistemi geliştirmelerini tamamladım.

Uygulamanın navigasyon mimarisini geliştirerek, ana sayfadaki varlıkların benzersiz ID'lerini React Navigation üzerinden detay sayfasına dinamik parametre olarak aktardım. Detay ekranında, CoinGecko API'den gelen 7 günlük geçmiş fiyat verilerini (Historical Data) asenkron olarak çeken yeni bir servis fonksiyonu kurguladım. Bu verileri görselleştirmek için react-native-chart-kit entegrasyonunu yaparak, "Bezier" (kavisli) çizim algoritmasıyla profesyonel borsa grafiklerini hayata geçirdim.

Ayrıca, global state yönetimini bir adım öteye taşıyarak favoritesSlice.js dosyasını oluşturdum. Bu sayede kullanıcıların seçtiği varlıkları cihaz tabanlı merkezi hafızada (Redux Store) tutan "Favorilere Ekleme" özelliğini, ikon tabanlı bir UI geri bildirimiyle birlikte sisteme dahil ettim. Büyük finansal verilerin (Milyar/Milyon) ekranda taşma yapmaması için formatCompactNumber gibi yardımcı fonksiyonlar yazarak arayüzün profesyonel nizamını korudum.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/ldD9mlir7Z4

Hafta 6: Portföy Yönetimi, CRUD Operasyonları ve Regex Veri Doğrulama

Hocam, bu hafta projenin etkileşimli veri yönetimi katmanını oluşturan Cüzdan (Portföy) Yönetimi, Regex tabanlı veri doğrulama ve Alt Menü (Bottom Tab Navigation) mimarisi geliştirmelerini tamamladım.

Uygulama navigasyon mimarisini @react-navigation/bottom-tabs ile profesyonel standartlara taşıyarak projeyi "Piyasalar" ve "Cüzdanım" olmak üzere iki ana sekmeye böldüm. Cüzdanım ekranında, kullanıcıların portföylerine manuel olarak varlık ekleyebileceği, mevcut miktarları güncelleyebileceği ve silebileceği (Create, Read, Update, Delete) kapsamlı bir Modal form yapısı kurguladım. Form güvenliğini sağlamak ve veri tutarlılığını korumak amacıyla /^\d*\.?\d*$/ düzenli ifadesi (Regex) ile özel bir validasyon katmanı geliştirdim; bu sayede form alanlarına harf, sembol veya negatif değer girilmesini donanımsal düzeyde engelledim.

Ek olarak, portfolioSlice.js üzerinden Redux Store'a bağladığım bu portföy verilerini, react-native-chart-kit ile oluşturduğum Pasta Grafiği (Pie Chart) ile entegre ederek kullanıcının anlık cüzdan dağılımını dinamik hale getirdim. Son olarak, iOS ve Android platformları arasındaki donanımsal çentik (Notch / Dynamic Island) farklılıklarının arayüzü bozmasını engellemek için useSafeAreaInsets kancası ile Cross-Platform (çapraz platform) başlık optimizasyonlarını tamamladım.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/6wnGWEs24TQ
