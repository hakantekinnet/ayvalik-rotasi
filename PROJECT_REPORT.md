# Ayvalık Rotası — Proje Raporu V2

> **Son Güncelleme:** 07 Ağustos 2026
> **Mimar:** Next.js 16 (App Router), Tailwind CSS v4, Sanity CMS v5
> **Dil:** TypeScript

---

## 1. Proje Yapısı & Routing (Project Structure & Routing)

Aşağıda projenin mevcut durumunu yansıtan temel dosya ve klasör ağacı bulunmaktadır:

```text
ayvalik-rotasi/
├── next.config.ts            # Next.js konfigürasyonu (image domains vb.)
├── .env.local                # Çevresel değişkenler (API key'ler, Sanity token'lar)
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Kök (Root) layout — global fontlar, SEO, meta, Viewport
│   │   ├── template.tsx      # Global Framer Motion geçiş animasyonları
│   │   ├── globals.css       # Tailwind v4 direktifleri ve global stiller
│   │   ├── page.tsx          # 🏠 Ana Sayfa (Server) — Sanity fetch ve HomeClient çağrısı
│   │   ├── feed/page.tsx     # 📰 Haber Akışı (Server)
│   │   ├── rotam/page.tsx    # 🗺️ Özel Rota (Client)
│   │   ├── vote/page.tsx     # 🗳️ Oylama Sayfası (Server)
│   │   ├── news/
│   │   │   └── [id]/page.tsx # 📄 Dinamik Rota: Haber Detay (Server)
│   │   ├── api/
│   │   │   ├── rate-location/route.ts # ⭐️ YENİ: Mekan puanlama API'si (force-dynamic)
│   │   │   ├── weather/route.ts       # 🌤️ Hava durumu proxy API'si
│   │   │   └── upload/route.ts        # 📤 Fotoğraf yükleme endpoint'i (Vercel Blob)
│   │   └── admin/[[...tool]]/page.tsx # 🔧 Sanity Studio Catch-all Rotası
│   │
│   ├── components/
│   │   ├── features/         # İş mantığı barındıran kompleks bileşenler (MapView, vs.)
│   │   ├── ui/               # Yeniden kullanılabilir arayüz elemanları (LocationCard, vs.)
│   │   └── layout/           # Navigasyon ve iskelet bileşenleri (BottomNav, vs.)
│   │
│   ├── sanity/
│   │   ├── schemaTypes/      # Sanity şemaları (place.ts, news.ts, poll.ts vb.)
│   │   └── components/       # YENİ: Özel Sanity Studio bileşenleri (MapPicker.tsx, vb.)
│   │
│   └── store/useRouteStore.ts # Zustand global state yönetimi
```

### Rotalama Mimarisi ve Sekmeler
Uygulama, alt navigasyon (BottomNav) üzerinden ulaşılan 3 ana sekmeye sahiptir:
1. **Harita (`/`)**: İnteraktif harita ve mekan keşfi. 
2. **Haberler (`/feed`)**: Haber ve etkinlik akışı.
3. **Oylama (`/vote`)**: Topluluk anketleri.

*Kritik Not: Kullanıcı deneyimi kesintisiz olsun diye mekanlar için (örneğin `src/app/mekan/[slug]/page.tsx` gibi) ayrı bir dinamik rota KULLANILMAMIŞTIR. Haritada seçilen mekanlar, doğrudan ana sayfada (`/`) bir Modal (Bottom Sheet - `LocationCard`) içerisinde SPA (Tek Sayfa Uygulaması) mantığıyla açılır. Dinamik rotalama sadece Haberler (`/news/[id]`) ve CMS (`/admin`) sayfaları için devrededir.*

---

## 2. Sanity Şemaları (Sanity Schemas)

Projeyi besleyen 3 temel Sanity doküman şeması ve içerdikleri güncel alanlar:

### 📍 `place` (Mekanlar - YENİ ÖZELLİKLERLE GÜNCELLENDİ)
| Alan (Field) | Tip (Type) | Açıklama |
|--------------|------------|----------|
| `title` | string | Mekan adı (Zorunlu) |
| `category` | string (radio) | Kategoriler: Tarihi, Manzara, Plaj, Mekan, Eğlence |
| `description` | text | Mekan hakkında açıklama yazısı |
| `images` | array [image] | Hotspot destekli çoklu fotoğraf galerisi |
| `location` | geopoint | GPS koordinatları (LeafletGeopointInput) |
| **`mapCoordinates`** | **object (x,y)** | **YENİ:** Harita görseli üzerindeki X ve Y yüzdelik konumunu belirleyen özel `MapPicker` bileşeni alanı. |
| `reelUrl` | url | Opsiyonel Instagram Reel linki |
| `isOpportunity` / `opportunityText` | boolean / string | Esnaf indirim fırsatı kontrolü ve metni |
| **`voteCount`** | **number** | **YENİ:** Mekana oy veren toplam kişi sayısı (Varsayılan: 0) |
| **`ratingLezzet` vb.** | **number** | **YENİ:** Kategoriye özel dinamik puan sayaçları (Lezzet, Fiyat, Deniz, Temizlik, Atmosfer, Genel Puan). Sadece mekanın ait olduğu kategoride Sanity Studio üzerinde görünür olurlar. |

### 📰 `news` (Haberler)
| Alan | Tip | Açıklama |
|------|-----|----------|
| `title` | string | Haber başlığı |
| `mainImage` | image | Kapak görseli (hotspot) |
| `summary` | text | Kartlarda listelenen kısa özet |
| `content` | array [block] | Zengin metin (Portable Text) detay içeriği |
| `isWeeklyEvent` | boolean | İşaretlendiğinde "Haftanın Etkinliği" olarak üstte gösterilir |

### 🗳️ `poll` (Oylamalar)
| Alan | Tip | Açıklama |
|------|-----|----------|
| `title` / `category` | string | Anket başlığı ve türü (`versus` veya `classic`) |
| `optionA_title` / `optionB_title` | string | Seçeneklerin başlık ve emojileri |
| `isActive` | boolean | Yalnızca aktif olanlar İstemci tarafında gösterilir |

---

## 3. Core UI Bileşenleri (Core UI Components)

### Feature Bileşenleri (İş Mantığı & Orkestrasyon)
- **`HomeClient` (Client):** Ana sayfanın orkestratörüdür. Kategori filtreleme state'ini tutar ve bunu `MapView`'a geçirir.
- **`MapView` (Client):** Gelişmiş, interaktif harita tuvalidir. Pan, zoom, kullanıcı konumu izleme işlevlerine sahiptir. Yeni `mapCoordinates` (X/Y) verilerini kullanarak pin'leri harita üzerine kusursuz bir şekilde yerleştirir. Pin tıklandığında `LocationCard`'ı tetikler.
- **`VotingView` (Client):** Sanity'den gelen `sanityPolls` verisini alarak kapışma ve anketleri yönetir.
- **`LocationRating` (Client) [YENİ]:** `LocationCard` içerisine entegre edilen dinamik puanlama bileşeni. Mekanın kategorisine göre (örn. Plaj ise Deniz/Temizlik/Tesis, Mekan ise Lezzet/Fiyat/Atmosfer) özel yıldızlı değerlendirme formları sunar ve API'ye istek atar. LocalStorage üzerinden çift oylamayı engeller.

### UI ve Layout Bileşenleri
- **`LocationCard` (UI):** Bottom Sheet (Açılır Modal). Framer Motion `drag="y"` ile kaydırarak kapatılabilir. Yeni desktop layout optimizasyonları kapsamında `max-w-md` sınıfı kullanılarak geniş ekranlarda merkeze hizalı ve estetik görünmesi sağlanmıştır. Mekan bilgileri, görsel carousel ve yeni `LocationRating` bileşenini barındırır.
- **`BottomNav` (Layout):** Sabit alt navigasyon çubuğu. `usePathname` üzerinden aktif sekmeyi belirler ve geçiş animasyonları sunar.

### Sanity Custom Bileşenleri
- **`MapPicker` (Sanity) [YENİ]:** Sanity Studio içerisine gömülü, görsel bir harita seçicidir. Editörün statik harita görseli (`ayvalik-harita-final.png`) üzerine tıklayarak tam bir X/Y yüzdelik koordinatı elde etmesini sağlar. Böylelikle manuel GPS sapmalarını sıfırlar ve pinlerin tasarıma tam oturmasını garantiler.

---

## 4. Data Flow & Fetching Architecture (Veri Akışı ve Mimari)

```text
[ Sanity CMS Veritabanı ]
           │
           │ (GROQ Queries)
           ▼
[ Server Components (page.tsx) ]
           │ (SSR Fetching - force-dynamic)
           │ 
           │ ⚠️ Serialization Strategy: 
           │ JSON.parse(JSON.stringify(data))
           ▼
[ Client Components (HomeClient, MapView vb.) ]
           │ (Props olarak iletilir)
           ▼
[ Kullanıcı Arayüzü (Harita UI / Listeler) ]
```

- **Fetching ve Caching Stratejisi:** Bütün ana sayfalar (Harita, Feed, Oylama) Server Component'tır ve `export const dynamic = 'force-dynamic'` ile işaretlenerek önbellekleme (caching) tamamen kapatılmış, her sayfa yenilemesinde en güncel verinin gelmesi garanti altına alınmıştır.
- **Serialization (Serileştirme):** Sanity üzerinden gelen veriler gizli prototype'lar veya tarih objeleri barındırabileceği için Client bileşenlerine geçerken Next.js Turbopack/hydration hatalarını engellemek amacıyla `JSON.parse(JSON.stringify())` işleminden geçirilmektedir.

---

## 5. API & Harici Entegrasyonlar (API & External Integrations)

Uygulamanın `src/app/api` dizininde çalışan kritik API Route'ları şunlardır:

- **`/api/rate-location` (YENİ):** `LocationRating` bileşeni üzerinden gelen yeni nesil puanlama isteklerini karşılar. Kullanıcıdan gelen kategorik puanları (örn. Lezzet: 5, Fiyat: 4) alır ve `client.patch().inc()` metoduyla Sanity CMS üzerindeki ilgili sayacı arttırır. Aynı zamanda `voteCount` (toplam oy) sayısını da 1 arttırır. `SANITY_API_WRITE_TOKEN` ile güvenli yazma (mutation) işlemi yapar.
- **`/api/weather`:** OpenWeatherMap API'sine proxy görevi yapar. Ayvalık'ın güncel sıcaklık, deniz suyu sıcaklığı ve rüzgar verilerini çekerek `WindWidget` (Harita üstü) ve `NewsView` (Haberler üstü) bileşenlerine veri sağlar.
- **`/api/upload`:** Vercel Blob servisini kullanarak kullanıcıların mekanlara veya oylamalara doğrudan yüksek çözünürlüklü fotoğraf yüklemesine olanak tanır.

---

## 6. Çevresel Değişkenler (Environment Variables)

Projenin yerelde (`.env.local`) ve Vercel üzerinde güvenli çalışabilmesi için gereken aktif değişkenler:

| Değişken Adı | Açıklama |
|--------------|----------|
| `WEATHER_API_KEY` | OpenWeatherMap entegrasyonu için gizli API anahtarı. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity projesinin ID'si (Client side erişilebilir). |
| `NEXT_PUBLIC_SANITY_DATASET` | Kullanılan veritabanı ortamı (örn. `production`). |
| **`SANITY_API_WRITE_TOKEN`** | **YENİ:** Puanlama ve veri yazma (rate-location) API'sinin Sanity veritabanını güncelleyebilmesi için gerekli olan yönetici (write) iznine sahip güvenli token. |

---

## 7. Temel Bağımlılıklar (Key Dependencies)

Projenin performansını ve estetiğini sağlayan temel kütüphaneler:

- **Next.js (`16.2.x`):** Server ve Client bileşenlerini harmanlayan App Router mimarisi.
- **Tailwind CSS (`v4`):** Yeni nesil hızlı CSS motoru. Hem mobil öncelikli arayüz hem de Desktop optimizasyonları için kullanılmıştır.
- **Sanity (`^5.31.x`) & next-sanity:** İçerik yönetimi (Headless CMS) ve entegrasyon.
- **Framer Motion (`^12.x`):** Sayfa geçişleri, MapView pin'lerinin dinamik ortaya çıkışı ve Modal (LocationCard) kaydırma/sürükleme animasyonları.
- **Zustand (`^5`):** Kullanıcının kendine özel oluşturduğu rotayı (`routeList`) tutan hafif global state yöneticisi.
- **Lucide React:** Uygulama içi SVG tabanlı ikonografi.
