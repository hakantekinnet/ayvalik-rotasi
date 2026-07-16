import { Contest } from "@/lib/types";

export const contests: Contest[] = [
  {
    id: "best-sunset",
    title: "Ayvalık'ın En Güzel Gün Batımı Noktası",
    description:
      "Ege'nin en büyüleyici gün batımını nerede izlediniz? Favori noktanıza oy verin!",
    deadline: "2026-08-01",
    totalVotes: 847,
    options: [
      {
        id: "seytan-sofrasi",
        title: "Şeytan Sofrası",
        image: "/images/seytan-sofrasi.jpg",
        votes: 342,
      },
      {
        id: "badavut",
        title: "Badavut Plajı",
        image: "/images/badavut.jpg",
        votes: 215,
      },
      {
        id: "cunda-sahil",
        title: "Cunda Sahil Yolu",
        image: "/images/cunda.jpg",
        votes: 178,
      },
      {
        id: "sarimsakli",
        title: "Sarımsaklı Kıyıları",
        image: "/images/sarimsakli.jpg",
        votes: 112,
      },
    ],
  },
  {
    id: "best-food",
    title: "En İyi Ayvalık Tostu Nerede Yenir?",
    description:
      "Ayvalık'ın efsanevi tostunu en iyi hangi mekan yapıyor? Oylarınızı bekliyoruz!",
    deadline: "2026-08-15",
    totalVotes: 1203,
    options: [
      {
        id: "cinar-tost",
        title: "Çınar Tost",
        image: "/images/tost-1.jpg",
        votes: 456,
      },
      {
        id: "derya-tost",
        title: "Derya Tost Evi",
        image: "/images/tost-2.jpg",
        votes: 389,
      },
      {
        id: "ayvalik-tostcusu",
        title: "Ayvalık Tostçusu",
        image: "/images/tost-3.jpg",
        votes: 234,
      },
      {
        id: "liman-tost",
        title: "Liman Tost",
        image: "/images/tost-4.jpg",
        votes: 124,
      },
    ],
  },
];
