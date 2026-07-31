# Ayvalık Rotası — Proje Raporu

> **Son güncelleme:** 28 Temmuz 2026  
> **Framework:** Next.js 16.2 (App Router, Turbopack)  
> **CMS:** Sanity v5 (Embedded Studio @ `/admin`)  
> **Deploy:** Vercel  
> **Dil:** TypeScript  

---

## 1. Proje Yapısı & Routing

```
ayvalik-rotasi/
├── sanity.config.ts          # Sanity Studio ana yapılandırması
├── sanity.cli.ts             # Sanity CLI yapılandırması
├── next.config.ts            # Next.js config (image domains: unsplash, cdn.sanity.io)
├── .env.local                # WEATHER_API_KEY, SANITY_PROJECT_ID, SANITY_DATASET
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout — Geist font, BottomNav, SEO metadata
│   │   ├── template.tsx      # Sayfa geçiş animasyonları (Framer Motion) + SplashScreen
│   │   ├── globals.css       # Tailwind v4 + özel CSS değişkenleri (aegean renk paleti)
│   │   ├── manifest.ts       # PWA manifest
│   │   ├── page.tsx          # 🏠 Ana Sayfa (Server) → Sanity'den places çeker → HomeClient'a geçer
│   │   ├── feed/
│   │   │   └── page.tsx      # 📰 Haberler (Server) → Sanity'den news + weeklyEvent çeker
│   │   ├── news/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # 📄 Haber Detay (Server) → Tekil haber + PortableText render
│   │   ├── vote/
│   │   │   └── page.tsx      # 🗳️ Oylama (Server) → Sanity'den aktif polls çeker
│   │   ├── admin/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx  # 🔧 Sanity Studio (force-dynamic)
│   │   └── api/
│   │       ├── weather/
│   │       │   └── route.ts  # 🌤️ OpenWeatherMap API proxy (force-dynamic)
│   │       └── upload/       # 📤 Vercel Blob upload endpoint
│   │
│   ├── components/
│   │   ├── features/         # İş mantığı bileşenleri
│   │   ├── ui/               # Yeniden kullanılabilir UI bileşenleri
│   │   └── layout/           # Navigasyon bileşenleri
│   │
│   ├── sanity/
│   │   ├── schemaTypes/      # Sanity doküman şemaları
│   │   ├── components/       # Özel Sanity input bileşenleri (Leaflet harita)
│   │   ├── lib/              # Sanity client, image helper, live preview
│   │   ├── env.ts            # Ortam değişkenleri yardımcısı
│   │   └── structure.ts      # Studio navigasyon yapısı
│   │
│   ├── data/                 # Statik fallback verileri (locations, news, contests)
│   └── lib/
│       └── types.ts          # TypeScript arayüzleri (LocationData, NewsArticle, vb.)
```

### Navigasyon

Uygulama 3 ana sekmeye sahiptir (alt navigasyon çubuğu ile):

| Sekme | Rota | Açıklama |
|-------|------|----------|
| 📍 Harita | `/` | İnteraktif Ayvalık haritası + mekan pinleri |
| 📰 Haberler | `/feed` | Haber akışı + Haftanın Etkinliği |
| 🗳️ Oylama | `/vote` | Topluluk anketleri ve kapışmalar |

Ek rotalar: `/news/[id]` (haber detay), `/admin` (Sanity Studio)

---

## 2. Sanity Şemaları

### 📰 `news` — Haberler
| Alan | Tip | Açıklama |
|------|-----|----------|
| `title` | string | Haber başlığı (5–120 karakter) |
| `mainImage` | image (hotspot) | Kapak görseli |
| `summary` | text | Kartlarda görünecek kısa özet |
| `content` | array [block, image] | Zengin metin editörü (Portable Text) |
| `isWeeklyEvent` | boolean | `true` ise "Haftanın Etkinliği" olarak öne çıkar |

### 📍 `place` — Mekanlar
| Alan | Tip | Açıklama |
|------|-----|----------|
| `title` | string | Mekan adı |
| `category` | string (radio) | Tarihi / Manzara / Plaj / Mekan / Eğlence |
| `description` | text | Mekan açıklaması |
| `images` | array [image] | Çoklu fotoğraf galerisi (hotspot destekli) |
| `location` | geopoint | GPS koordinatları (özel Leaflet input bileşeni) |
| `reelUrl` | url | İsteğe bağlı Instagram Reel linki |

### 🗳️ `poll` — Oylamalar
| Alan | Tip | Açıklama |
|------|-----|----------|
| `title` | string | Oylama başlığı |
| `category` | string (radio) | `versus` (ikili kapışma) veya `classic` (klasik anket) |
| `emoji` | string | Kategori emojisi |
| `optionA_title` / `optionA_emoji` | string | Seçenek A başlığı ve emojisi |
| `optionB_title` / `optionB_emoji` | string | Seçenek B başlığı ve emojisi |
| `isActive` | boolean | Sadece aktif oylamalar ön yüzde gösterilir |

---

## 3. Core UI Bileşenleri

### Feature Bileşenleri (`src/components/features/`)

| Bileşen | Tip | Açıklama |
|---------|-----|----------|
| **HomeClient** | Client | Ana sayfa wrapper — kategori filtresi state yönetimi, MapView'a `places` prop geçirir |
| **MapView** | Client | İnteraktif stilize harita — GPS→yüzde dönüşümü, animasyonlu pin'ler, kategori filtresi, "Konumumu Bul" özelliği |
| **WindWidget** | Client | Rüzgar durumu ve plaj önerisi widget'ı — `/api/weather`'dan veri çeker |
| **NewsView** | Client | Haber akışı dashboard — hava durumu özeti, Haftanın Etkinliği kartı, haber listesi. `sanityNews` ve `weeklyEvent` propları alır |
| **VotingView** | Client | Oylama sayfası — `sanityPolls` prop'u ile dinamik versus/classic anket kartları render eder |
| **NewsFeed** | Client | Basit haber feed sarmalayıcısı |
| **VoteContest** | Client | Tek bir yarışma kartı bileşeni |

### UI Bileşenleri (`src/components/ui/`)

| Bileşen | Açıklama |
|---------|----------|
| **LocationCard** | Bottom sheet mekan detay kartı — drag-to-dismiss, `imageUrls[]` galeri carousel, dot göstergeleri, fotoğraf yükleme |
| **NewsCard** | Tekil haber kartı bileşeni |
| **NewsSkeleton** | Haber yüklenirken iskelet (loading skeleton) animasyonu |
| **SplashScreen** | Uygulama açılış animasyonu |
| **VoteCard** | Tekil oylama kartı bileşeni |

### Layout Bileşenleri (`src/components/layout/`)

| Bileşen | Açıklama |
|---------|----------|
| **BottomNav** | Sabit alt navigasyon çubuğu — 3 sekme (Harita, Haberler, Oylama), aktif sayfa vurgusu, Framer Motion animasyonları |

### Sanity Bileşenleri (`src/sanity/components/`)

| Bileşen | Açıklama |
|---------|----------|
| **LeafletGeopointInput** | Özel Sanity v3 input bileşeni — OpenStreetMap + Leaflet ile interaktif harita. Tıkla → pin bırak, sürükle → güncelle. API key gerektirmez. Varsayılan konum: Ayvalık merkezi |

---

## 4. Veri Akışı & Fetching Mimarisi

### Server → Client Veri Akışı

```
┌─────────────────────────────────────────────────────────┐
│  Sanity CMS (sanity.io)                                 │
│  ├── news documents                                     │
│  ├── place documents                                    │
│  └── poll documents                                     │
└────────────────────┬────────────────────────────────────┘
                     │ GROQ Queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Server Components (src/app/*/page.tsx)                  │
│  ├── page.tsx      → getPlaces()     → GROQ fetch       │
│  ├── feed/page.tsx → getNews()       → GROQ fetch       │
│  │                 → getWeeklyEvent() → GROQ fetch       │
│  ├── vote/page.tsx → getPolls()      → GROQ fetch       │
│  └── news/[id]/    → client.fetch()  → GROQ fetch       │
│                                                         │
│  ⚠️ JSON.parse(JSON.stringify(data))                     │
│     Turbopack serialization hatalarını önlemek için       │
└────────────────────┬────────────────────────────────────┘
                     │ Serialized Props
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Client Components                                      │
│  ├── HomeClient    ← places: LocationData[]              │
│  ├── NewsView      ← sanityNews, weeklyEvent             │
│  ├── VotingView    ← sanityPolls: SanityPoll[]           │
│  └── MapView       ← places: LocationData[]              │
│                                                         │
│  Hepsi statik fallback verisine sahiptir (src/data/)     │
└─────────────────────────────────────────────────────────┘
```

### Kritik Uygulama Detayları

1. **Serileştirme:** Sanity client'ın döndürdüğü nesneler serileştirilemez prototype zinciri içerebilir. Tüm Server → Client prop geçişlerinde `JSON.parse(JSON.stringify(data))` uygulanır.

2. **Dinamik Rendering:** Tüm Sanity-bağlantılı sayfalar `export const dynamic = 'force-dynamic'` kullanır — önbellekleme devre dışı, her istekte taze veri.

3. **Fallback Stratejisi:** Sanity boş dönerse veya hata verirse, `src/data/` dizinindeki statik mock veri kullanılır. UI hiçbir zaman boş/kırık kalmaz.

4. **GPS → Harita Dönüşümü:** Sanity'deki `geopoint` (lat/lng) verileri, `gpsToMapPercent()` fonksiyonu ile stilize harita üzerindeki yüzde konumlarına dönüştürülür (bounding box: 39.28–39.38°N, 26.64–26.78°E).

---

## 5. API & Harici Entegrasyonlar

### 🌤️ Hava Durumu API'si (`/api/weather`)
- **Kaynak:** OpenWeatherMap API (`api.openweathermap.org/data/2.5/weather`)
- **Konum:** Ayvalık, TR (sabit koordinatlar)
- **Çekilen Veri:** Sıcaklık, deniz sıcaklığı, rüzgar hızı/yönü, gün batımı saati
- **Kullanım Yerleri:** `WindWidget` (ana sayfa) ve `NewsView` (haber sayfası üst bar)
- **Önbellek:** `force-dynamic` + `revalidate: 0` — her zaman taze veri
- **Fallback:** API başarısız olursa sabit varsayılan değerler döner (28°C, 22°C deniz, vb.)

### 🗺️ Leaflet Harita Input (Sanity Studio)
- **Kütüphane:** `leaflet` v1.9.4
- **Tile Sağlayıcı:** OpenStreetMap (ücretsiz, API key gerektirmez)
- **Kullanım:** Sanity Studio'da `place` dokümanının `location` alanı için özel input bileşeni
- **Özellikler:** Tıkla → pin bırak, sürükle → güncelle, koordinat gösterimi, temizle butonu

### 📤 Dosya Yükleme (`/api/upload`)
- **Platform:** Vercel Blob Storage
- **Kullanım:** LocationCard'daki fotoğraf yükleme özelliği

### 📝 Portable Text (`@portabletext/react`)
- **Kullanım:** `/news/[id]` haber detay sayfasında Sanity'nin zengin metin (block content) içeriğini render eder

---

## 6. Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `WEATHER_API_KEY` | OpenWeatherMap API anahtarı |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity proje ID'si |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset adı (`production`) |

---

## 7. Bağımlılıklar (Öne Çıkanlar)

| Paket | Versiyon | Kullanım |
|-------|----------|----------|
| `next` | 16.2.10 | Framework |
| `react` | 19.2.4 | UI kütüphanesi |
| `sanity` | ^5.31.1 | CMS Studio |
| `next-sanity` | ^13.2.1 | Sanity + Next.js entegrasyonu |
| `framer-motion` | ^12.42.2 | Animasyonlar (sayfa geçişleri, pin animasyonları, bottom sheet) |
| `lucide-react` | ^1.24.0 | İkon kütüphanesi |
| `leaflet` | ^1.9.4 | Sanity Studio harita input bileşeni |
| `@portabletext/react` | ^7.0.1 | Zengin metin (rich text) render |
| `@vercel/blob` | ^2.6.1 | Dosya yükleme |
| `tailwindcss` | ^4 | CSS framework |
| `styled-components` | ^6.4.4 | Sanity Studio iç stili |
