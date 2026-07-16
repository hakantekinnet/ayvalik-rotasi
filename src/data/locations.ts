import { Location } from "@/lib/types";

export const locations: Location[] = [
  {
    id: "cunda-island",
    name: "Cunda Adası",
    description:
      "Ayvalık'ın incisi Cunda, taş evleri, dar sokakları ve muhteşem deniz manzarasıyla büyüler. Taze deniz ürünleri ve zeytinyağlı mezeler eşliğinde unutulmaz bir deneyim.",
    image: "/images/cunda.jpg",
    coordinates: { x: 35, y: 30 },
    instagramUrl: "https://www.instagram.com/reel/example1",
    category: "historic",
  },
  {
    id: "seytan-sofrasi",
    name: "Şeytan Sofrası",
    description:
      "Ayvalık'ın en ünlü gün batımı noktası. Efsaneye göre şeytanın ayak izini taşıyan kayadan, adaları ve ege'nin mavisini izlemek paha biçilmez.",
    image: "/images/seytan-sofrasi.jpg",
    coordinates: { x: 72, y: 55 },
    instagramUrl: "https://www.instagram.com/reel/example2",
    category: "viewpoint",
  },
  {
    id: "sarimsakli-beach",
    name: "Sarımsaklı Plajı",
    description:
      "Ege'nin en güzel plajlarından biri. Altın kumları ve berrak suları ile aileler ve su sporları tutkunları için mükemmel bir tercih.",
    image: "/images/sarimsakli.jpg",
    coordinates: { x: 55, y: 75 },
    instagramUrl: "https://www.instagram.com/reel/example3",
    category: "beach",
  },
  {
    id: "ayvalik-old-town",
    name: "Ayvalık Eski Şehir",
    description:
      "Osmanlı ve Rum mimarisinin iç içe geçtiği tarihi sokaklar. Her köşede bir keşif, her duvarda bir hikaye sizi bekliyor.",
    image: "/images/old-town.jpg",
    coordinates: { x: 48, y: 42 },
    instagramUrl: "https://www.instagram.com/reel/example4",
    category: "historic",
  },
  {
    id: "badavut-beach",
    name: "Badavut Plajı",
    description:
      "Doğal güzelliğiyle ünlü, sakin ve huzurlu bir plaj. Gün batımında altın rengine bürünen kumsalı ile fotoğraf tutkunlarının vazgeçilmezi.",
    image: "/images/badavut.jpg",
    coordinates: { x: 25, y: 65 },
    instagramUrl: "https://www.instagram.com/reel/example5",
    category: "beach",
  },
  {
    id: "patriça-koyu",
    name: "Patriça Koyu",
    description:
      "Tekne turlarının vazgeçilmez durağı. Turkuaz suları ve çam ormanlarıyla çevrili bu koy, doğayla başbaşa kalmak isteyenler için ideal.",
    image: "/images/patrica.jpg",
    coordinates: { x: 18, y: 45 },
    instagramUrl: "https://www.instagram.com/reel/example6",
    category: "nature",
  },
];
