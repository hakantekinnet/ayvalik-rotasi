import { defineType, defineField } from 'sanity'

export const poll = defineType({
  name: 'poll',
  title: 'Oylamalar',
  type: 'document',
  icon: () => '🗳️',
  fields: [
    defineField({
      name: 'title',
      title: 'Oylama Başlığı',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Örn: "Haftanın Kapışması: Hangi Plaj?"',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: '⚔️ Versus (İkili Kapışma)', value: 'versus' },
          { title: '📊 Klasik Anket', value: 'classic' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'emoji',
      title: 'Kategori Emojisi',
      type: 'string',
      description: 'Anket kartının yanında gösterilecek emoji (ör: ⚔️, 🍽️)',
    }),
    defineField({
      name: 'optionA_title',
      title: 'Seçenek A — Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'optionA_emoji',
      title: 'Seçenek A — Emoji',
      type: 'string',
      description: 'Örn: 🏖️',
    }),
    defineField({
      name: 'optionB_title',
      title: 'Seçenek B — Başlık',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'optionB_emoji',
      title: 'Seçenek B — Emoji',
      type: 'string',
      description: 'Örn: 🌊',
    }),
    defineField({
      name: 'isActive',
      title: 'Aktif mi?',
      type: 'boolean',
      initialValue: true,
      description: 'Sadece aktif oylamalar ön yüzde gösterilir.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
