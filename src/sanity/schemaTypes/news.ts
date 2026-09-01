import { defineType, defineField } from 'sanity'

export const news = defineType({
  name: 'news',
  title: 'Haberler',
  type: 'document',
  icon: () => '📰',
  groups: [
    {
      name: 'sourceInfo',
      title: 'Kaynak ve Yayın Bilgileri',
      icon: () => '📎',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: (rule) => rule.required().min(5).max(120),
    }),
    defineField({
      name: 'mainImage',
      title: 'Kapak Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'Haber kartlarında görünecek kısa açıklama.',
    }),
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'isWeeklyEvent',
      title: 'Haftanın Etkinliği Olarak İşaretle',
      type: 'boolean',
      initialValue: false,
      description: 'Bu haberi "Haftanın Etkinliği" olarak öne çıkarır.',
    }),

    // --- KAYNAK VE YAYIN BİLGİLERİ ---

    defineField({
      name: 'sourceName',
      title: 'Kaynak Adı',
      type: 'string',
      description: 'Örn: Ayvalık Belediyesi',
      group: 'sourceInfo',
    }),
    defineField({
      name: 'sourceUrl',
      title: "Kaynak URL'si",
      type: 'url',
      group: 'sourceInfo',
    }),
    defineField({
      name: 'originalPublishedAt',
      title: 'Orijinal Yayın Tarihi',
      type: 'datetime',
      group: 'sourceInfo',
    }),
    defineField({
      name: 'verifiedAt',
      title: 'Son Doğrulama Tarihi',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      group: 'sourceInfo',
    }),
    defineField({
      name: 'expiresAt',
      title: 'Sona Erme Tarihi',
      type: 'datetime',
      description: 'Bu tarihten sonra içerik "Sona Erdi" olarak işaretlenecek.',
      group: 'sourceInfo',
    }),
    defineField({
      name: 'imageCredit',
      title: 'Görsel Kaynağı / Telif',
      type: 'string',
      description: 'Örn: Ayvalık Belediyesi Basın Birimi',
      group: 'sourceInfo',
    }),
    defineField({
      name: 'editorNote',
      title: 'Ayvalık Rotası Notu',
      type: 'text',
      description: 'Habere katacağımız özgün değer, rota uyarıları veya ziyaretçi tavsiyeleri.',
      group: 'sourceInfo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
