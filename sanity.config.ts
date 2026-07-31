'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/admin/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import type {DocumentActionComponent, DocumentActionsContext} from 'sanity'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

// Custom document action: "📱 Hikaye Üret"
const GenerateStoryAction: DocumentActionComponent = (props) => {
  return {
    label: '📱 Hikaye Üret',
    tone: 'primary' as const,
    onHandle: () => {
      const doc = props.published || props.draft
      const title = (doc?.title as string) || 'Ayvalık Rotası'

      // Extract summary: try summary field, then first text block from content
      let summary = ''
      if (doc?.summary) {
        summary = doc.summary as string
      } else if (doc?.content && Array.isArray(doc.content)) {
        // Extract first plain text span from Portable Text blocks
        for (const block of doc.content as Array<{_type?: string; children?: Array<{text?: string}>}>) {
          if (block._type === 'block' && block.children) {
            const text = block.children.map((c) => c.text || '').join('')
            if (text.trim()) {
              summary = text.trim().length > 120 ? text.trim().slice(0, 120) + '...' : text.trim()
              break
            }
          }
        }
      }

      // Resolve the image URL from the Sanity image reference
      const mainImage = doc?.mainImage as {asset?: {_ref?: string}} | undefined
      let imageUrl = ''
      if (mainImage?.asset?._ref) {
        // Convert Sanity image ref to CDN URL
        // Format: image-<id>-<dimensions>-<format>  →  https://cdn.sanity.io/images/<projectId>/<dataset>/<id>-<dimensions>.<format>
        const ref = mainImage.asset._ref
        const [, id, dimensions, format] = ref.split('-')
        imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
      }

      let storyUrl = `/api/story?title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}`
      if (summary) {
        storyUrl += `&summary=${encodeURIComponent(summary)}`
      }
      window.open(storyUrl, '_blank')
    },
  }
}

export default defineConfig({
  basePath: '/admin',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    actions: (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
      console.log('Action overriding for:', context.schemaType)
      return context.schemaType === 'news' ? [GenerateStoryAction, ...prev] : prev
    },
  },
})
