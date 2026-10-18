# Görsel kalite karşılaştırması

Portfolio artık Q95 WebP dosyalarını kullanır. Orijinal PNG ve Q90 dosyaları korunmuştur. CSS, efektler, çözünürlükler ve animasyonlar değiştirilmedi.

## Ekranı açma

```sh
npm run dev
```

Terminaldeki Local adresine `/__image-compare` ekleyin; örneğin `http://127.0.0.1:5173/__image-compare`. Port doluysa Vite başka port seçebilir.

Dört görsel arasında seçim yapabilirsiniz. Yan yana görünümde üç panel aynı ölçekte gösterilir ve kaydırmaları eşzamanlıdır. Tekli görünümde PNG / Q95 / Q90 düğmeleri aynı konumda sürüm değiştirir. `%100` gerçek CSS piksel boyutudur; tarayıcı zoom'unu da %100 tutun. `Ekrana sığdır` genel kompozisyonu incelemek içindir. İnce renk geçişlerini, ışıkları, gitar tellerini, araba kenarlarını ve karanlık dokuları %100 görünümde karşılaştırın.

Karşılaştırma yolu yalnızca Vite geliştirme middleware'i ile sunulur. Normal navigasyona eklenmez. Üretim `dist/` çıktısında bu araç, raporu ve kullanılmayan PNG/Q90 alternatifleri bulunmaz.

## Ölçümler

Boyut birimi KiB'dir (1024 bayt). Kazanç orijinal PNG'nin bayt boyutuna göre hesaplanmıştır; tam bayt değerleri ve SHA256 özetleri `image-report.json` içindedir.

| Görsel | Çözünürlük | PNG | Q95 | Q95 kazanç | Q90 | Q90 kazanç |
|---|---|---:|---:|---:|---:|---:|
| music-desktop | 1672×941 | 2438.6 | 565.1 | %76.83 | 430.7 | %82.34 |
| software-desktop | 1672×941 | 2497.8 | 550.6 | %77.96 | 405.1 | %83.78 |
| music-mobile | 941×1672 | 2253.8 | 491.1 | %78.21 | 378.7 | %83.20 |
| software-mobile | 941×1672 | 2459.4 | 522.9 | %78.74 | 388.2 | %84.22 |

Kaynakların tamamı 8 bit sRGB, RGB, alfa içermeyen PNG'dir; gömülü ICC profili bulunmaz. Yeniden boyutlandırma veya kırpma uygulanmadı. Sharp/libwebp `effort: 6`, `smartSubsample: true` ile Q95 ve Q90 üretildi. Varsa ICC profilini koruyan `keepIccProfile()` kullanıldı; gereksiz metadata aktarılmadı. Kayıplı WebP piksel düzeyinde PNG ile aynı değildir; özellikle doygun renk kenarlarında renk alt örneklemesi fark oluşturabilir.

Kalite önceliği için **Q95 ilk inceleme adayıdır**, kullanıcının onayıyla seçilmiştir. Dört kaynaktan %100 detay kırpmaları görsel olarak incelendi; bu sınırlı inceleme tüm görselde görünür kayıp olmadığına dair garanti değildir. Kabul edilmeyen fark görülürse PNG kullanımını koruyun; ayrıca kayıpsız WebP değerlendirilebilir. SSIM ölçümü yapılmadı.

## Yeniden üretme

Sharp yalnızca geçici araç klasörüne kuruldu; ana `package.json` ve `package-lock.json` değiştirilmedi, runtime bağımlılığı eklenmedi.

PowerShell:

```powershell
npm install --prefix "$env:TEMP/portfolio-image-tools" --no-save sharp
node tools/optimize-images.mjs "$env:TEMP/portfolio-image-tools"
```

Script yalnızca sekiz WebP alternatifini ve JSON raporunu üretir. Orijinal PNG özetlerini işlem öncesi/sonrası karşılaştırır ve her alternatifin çözünürlüğünü doğrular.

## Yükleme incelemesi

`picture/source` 700px ve altında mobil PNG'yi, üstünde masaüstü PNG'yi seçer. Import edilen dört dosyanın build'de bulunması dördünün tarayıcıda indirilmesi anlamına gelmez. Kullanılmayan varyant için ayrı preload veya `new Image()` isteği yoktur. Cihaz genişliği breakpoint'i geçerse tarayıcı yeni uygun varyantı indirebilir; bu gerekli bir indirmedir.

Açılış yükleyicisi doğrudan iki görünür sahnenin `img` yükleme/hata olaylarını takip eder. İkisi sonuçlandığında açılır; hata veya 12 saniye zaman aşımında kilitlenmez. Bölüm geçişleri aynı picture düğümlerini kullanır; yükleyici yeniden başlamaz. Vite import yolları ve mevcut göreli `base` GitHub Pages alt dizinlerinde geçerlidir.

Üretim build'i ve geliştirme HTTP uçları doğrulandı. Tarayıcı ağ paneliyle cihaz bazlı istek sayısı ve karşılaştırma arayüzü etkileşimleri bu oturumda doğrulanmadı.
