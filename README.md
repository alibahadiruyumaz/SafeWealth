SafeWealth: Cihaz Tabanlı Finansal Analitik ve Portföy Yönetimi

Geliştirici: Ali Bahadır Uyumaz (Öğrenci No: 22290875)
Danışman: Öğr. Gör. ENVER BAĞCI
Ders: BLM4538 - IOS İle Mobil Uygulama Geliştirme II

Proje Vizyonu
SafeWealth, heterojen finansal ekosistemlerde yer alan kullanıcı portföylerini tek bir asenkron arayüz üzerinden konsolide eden, React Native tabanlı bir iOS analitik platformudur. "Privacy-First" (Gizlilik Öncelikli) yaklaşımıyla, hassas finansal veriler bulut yerine cihaz üzerinde işlenmektedir.

---

🚀 Uygulamayı Hemen İndir ve Test Et

Uygulamanın 11. Hafta (Final) derlemesini Android cihazınıza kurmak için aşağıdaki QR kodu telefonunuzun kamerasına okutabilir veya indirme linkine tıklayabilirsiniz.

[📱 APK Dosyasını İndir (v1.0.0)] 

(Buraya da kendi oluşturduğun kalıcı QR kodun görselini ekle)

---

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

Hafta 7: Yerel Depolama (Persistence) Mimarisi ve Çevrimdışı Veri Tutarlılığı

Hocam, bu hafta projenin ana vaadi olan "Privacy-First" (Gizlilik Öncelikli) cihaz tabanlı veri yönetimi mimarisini hayata geçirdim. Kullanıcının hassas finansal verilerini bulut sunucuları yerine doğrudan cihazın yerel hafızasında asenkron olarak saklamak için AsyncStorage ve Redux Persist entegrasyonunu tamamladım.  

Bütün global state'i kaydetmek yerine katı bir veri izolasyonu uygulayarak "Whitelist" kurgusu geliştirdim. Kullanıcının portföy varlıkları ve favori seçimleri cihaz hafızasına yazılırken, API'den gelen anlık piyasa fiyatlarını (crypto slice) kalıcılık çemberinin dışında bıraktım. Bu mimari hamle, uygulamanın çevrimdışı (offline) açıldığı durumlarda eski fiyatların güncelmiş gibi gösterilmesi riskini tamamen ortadan kaldırdı. Ayrıca, uygulamanın başlatılması sırasında cihaz diskinden belleğe veri aktarımının asenkron doğasından kaynaklanabilecek UI zafiyetlerini (cüzdanın geçici olarak boş görünmesi) önlemek amacıyla arayüz yüklemesini PersistGate bileşeni ile donanımsal düzeyde kilitledim. Bu sayede uygulamanın internet bağlantısı koptuğunda dahi son bilinen verilerle %100 erişilebilir kalması hedefini sağladım.  

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/wBaV_1o7iLM

Hafta 8: Finansal Analitik Motoru ve On-Device Portföy Optimizasyonu

Hocam, bu hafta SafeWealth projesini basit bir bakiye görüntüleyiciden tam teşekküllü bir analitik platforma dönüştüren "Finansal Analitik Motoru"nun geliştirmelerini tamamladım. Bulut tabanlı hesaplama yaklaşımlarını reddederek, tüm matematiksel analizlerin doğrudan cihazın yerel işlemcisi (CPU) üzerinde çalışmasını sağlayan O(N) zaman karmaşıklığına sahip izole bir motor (`utils/analytics.js`) inşa ettim.

Veritabanı şemasını (Redux Store) güncelleyerek varlık modeline "Alış Maliyeti" (Buy Price) parametresini entegre ettim. Bu genişletilmiş veri yapısı sayesinde, gerçekleşmemiş Kar/Zarar (PnL) oranlarını sistemime başarıyla dahil ettim. Ayrıca, portföydeki her bir varlığın kendi yüzdesel ağırlığı ile 24 saatlik değişim oranını çaprazlayarak, tüm cüzdanın genel performansını gösteren "Ağırlıklı 24 Saatlik Portföy Volatilitesi" algoritmasını geliştirdim. 

Kullanıcı deneyimini (UX) hızlandırmak adına, form üzerinden bir varlık seçildiği an API'deki güncel fiyatı asenkron olarak "Alış Maliyeti" kutusuna otomatik dolduran akıllı bir Auto-Fill mekanizması kurguladım. İşlemci donanımının ondalıklı hesaplamalardaki kronik problemi olan IEEE 754 Yüzer Nokta (Floating-Point) hatalarına karşı, verileri arayüze aktarmadan önce donanımsal düzeyde sekiz haneli bir temizleme (Formatting) filtresiyle zırhlandırdım.

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/wWrvEJpzjfQ

Hafta 9: Otonom Tema Mimarisi, Donanım İvmelendirmesi ve Kurumsal Kimlik

Hocam, bu hafta projenin kullanıcı deneyimini (UX) endüstri standartlarına taşımak ve donanım performansını maksimize etmek amacıyla derin mimari müdahaleleri kapsayan "UI/UX ve Performans Optimizasyonu" maddelerini tamamladım.  

Uygulamanın arayüz tepkime süresini artırmak amacıyla, animasyon ve geçiş mantığını JavaScript thread'inden arındırarak useNativeDriver parametresi üzerinden doğrudan cihazın grafik işlemcisine (GPU) devrettim. Bu müdahale sayesinde, veri yoğunluklu listelerde kayıpsız 60 FPS akıcılığını güvence altına aldım. Eş zamanlı olarak, işletim sisteminin Appearance API katmanına bağlanarak uygulamanın cihazın sistem stiline (Dark/Light) otonom tepki vermesini sağlayan merkezi bir tema mimarisi kurguladım.  

Kurumsal kimlik tarafında ise, projenin "TempApp" olan varsayılan ismini ve logolarını SafeWealth vizyonuna uygun profesyonel varlıklarla (assets) güncelledim. Uygulamanın açılış ekranını (Splash Screen) koyu tema vizyonuna uygun #121212 arka plan rengiyle donanımsal düzeyde yapılandırarak, kullanıcı girişindeki "flash-bang" etkisini tamamen ortadan kaldırdım. Son olarak, app.json manifest dosyası üzerinden projenin ana odağına hizmet etmeyen atıl platform (Web/Legacy) kalıntılarını temizleyerek derleme boyutunu (bundle size) optimize ettim ve sistemi 10. hafta fiziksel cihaz testlerine hazır hale getirdim.  

Bu haftaki ilerlememi detaylıca anlattığım videom şu linktedir: https://youtu.be/2c7wGOlOROY

Hafta 10: Fiziksel Donanım Testleri, Biyometrik Güvenlik ve UI/UX Cilası

Hocam, bu hafta 10. hafta yönergeleri doğrultusunda asenkron süreç yönetimlerini ve fiziksel cihaz testlerini (debugging) tamamlayarak uygulamayı "Production-Ready" (canlı ortama hazır) seviyesine taşıdım.

Projenin "Privacy-First" vizyonuna uygun olarak, expo-local-authentication altyapısı kullanılarak uygulamaya FaceID ve TouchID destekli biyometrik güvenlik duvarı entegre edildi. Bununla birlikte, fiziksel donanım testleri kapsamında arayüze "Pull-to-Refresh" (aşağı çekerek yenileme) özelliği kazandırıldı. Bu süreçte Redux Thunk üzerinde karşılaşılan asenkron darboğazlar .unwrap yönetimiyle çözülerek olası bellek sızıntılarının (Memory Leak) önüne geçildi.

Kullanıcı deneyimini iyileştirmek ve performansı artırmak adına, API limitlerine takılmamak için doğrudan Redux State üzerinde çalışan, sıfır gecikmeli yerel arama motoru (Local Search) ve "Tümü / Favorilerim" filtreleme sistemi geliştirildi. Son olarak, portföyün boş olduğu veya arama sonuçlarının bulunamadığı senaryolarda ekranın anlamsız kalmasını engellemek için, uygulamanın otonom temasıyla tam uyumlu kurumsal Empty State (Boş Durum) tasarımları sisteme dahil edildi.

Bu haftaki donanım testlerimi ve geliştirmelerimi detaylıca anlattığım videom şu linktedir: https://youtu.be/b11EW-K6D2E

Hafta 11: Global Haptic Engine, UI/UX Cilası ve EAS Production Build

Hocam, bu hafta projenin "Code Freeze" (Kod Dondurma) aşamasını tamamlayarak, donanım seviyesindeki son optimizasyonları ve nihai Production (Canlı) derleme işlemlerini gerçekleştirdim.

Kullanıcı deneyimini artırmak için projeye expo-haptics (dokunsal geri bildirim) entegre ettim ve bu ayarı Redux (settingsSlice) üzerinden global state'e bağlayarak cihaz hafızasında kalıcı olmasını sağladım. Çapraz platform (Cross-Platform) sorunlarından olan Android'deki donanımsal "çift titreşim" (double pulse) çakışmasını Platform.OS kontrolüyle izole ettim. React Navigation sayfa geçişlerindeki kronik "beyaz ekran parlaması" zafiyetini ise kök katmanda arka plan sabitlemesi yaparak kökten çözdüm. Ayrıca, kritik veri silme işlemlerindeki ilkel uyarı pencerelerini (Native Alert), uygulamanın temasına otonom tepki veren özel bir Modal (Custom Alert) yapısıyla değiştirdim.

Son olarak, uygulamanın bağımsız bir ürüne dönüşmesi için Expo Application Services (EAS) CLI yapılandırmasını tamamladım. eas.json dosyasını doğrudan cihaza yüklenebilir "buildType: apk" formatında konfigüre ederek, projenin nihai kurulum dosyasını (APK) bulut sunucularında derledim ve fiziksel cihaza aktarımını başarıyla gerçekleştirdim.

Bu haftaki son optimizasyonları ve canlı APK derleme sürecimi anlattığım videom şu linktedir: [VİDEO_LİNKİ_BURAYA_GELECEK]
