import { defineType, defineField } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Etkinlikler',
  type: 'document',
  icon: () => '🎭',
  fields: [
    defineField({
      name: 'title',
      title: 'Etkinlik Başlığı',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Etkinlik Tarihi ve Saati',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Kısa Açıklama',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Etkinlik Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'location',
      title: 'Etkinlik Mekanı',
      type: 'reference',
      to: [{ type: 'place' }],
      description: 'Bu etkinliğin gerçekleşeceği mekanı seçin. Rota planlamasıyla bağlantı kurar.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
      media: 'coverImage',
    },
    prepare({ title, date, media }) {
      const formatted = date
        ? new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Tarih belirtilmedi';
      return {
        title,
        subtitle: formatted,
        media,
      };
    },
  },
})
