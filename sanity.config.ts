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
  const {published} = props

  return {
    label: '📱 Hikaye Üret',
    tone: 'primary',
    onHandle: () => {
      if (!published) {
        alert('Lütfen önce haberi yayınlayın.')
        return
      }

      const title = (published.title as string) || 'Ayvalık Rotası'

      // Resolve the image URL from the Sanity image reference
      const mainImage = published.mainImage as {asset?: {_ref?: string}} | undefined
      let imageUrl = ''
      if (mainImage?.asset?._ref) {
        // Convert Sanity image ref to CDN URL
        // Format: image-<id>-<dimensions>-<format>  →  https://cdn.sanity.io/images/<projectId>/<dataset>/<id>-<dimensions>.<format>
        const ref = mainImage.asset._ref
        const [, id, dimensions, format] = ref.split('-')
        imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
      }

      const storyUrl = `/api/story?title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}`
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
      if (context.schemaType === 'news') {
        return [...prev, GenerateStoryAction]
      }
      return prev
    },
  },
})
