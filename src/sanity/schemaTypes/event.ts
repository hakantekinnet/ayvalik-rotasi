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
      name: 'slug',
      title: 'URL Uzantısı (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
      name: 'startsAt',
      title: 'Başlangıç Tarihi ve Saati',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Bitiş Tarihi ve Saati',
      type: 'datetime',
      description: 'Opsiyonel. Belirtilmezse etkinlik tek günlük kabul edilir.',
    }),
    defineField({
      name: 'location',
      title: 'Etkinlik Mekanı',
      type: 'reference',
      to: [{ type: 'place' }],
      description: 'Bu etkinliğin gerçekleşeceği mekanı seçin. Rota planlamasıyla bağlantı kurar.',
      hidden: ({ document }) => !document?.routeEnabled,
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document;
          if (doc?.routeEnabled && !value) {
            return 'Rota aktifken mekan seçilmelidir.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'routeEnabled',
      title: 'Rotaya Ekle Butonu Göster',
      type: 'boolean',
      initialValue: false,
      description: 'Aktifse, etkinlik kartında "Rotaya Ekle" butonu gösterilir ve mekan seçimi zorunlu olur.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'startsAt',
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
