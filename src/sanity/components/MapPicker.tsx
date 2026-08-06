import { Card, Text } from '@sanity/ui'
import { set, type ObjectInputProps } from 'sanity'
import React, { useCallback } from 'react'

export default function MapPicker(props: ObjectInputProps) {
  const { onChange, value } = props

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Number(
        (((e.clientX - rect.left) / rect.width) * 100).toFixed(2)
      )
      const y = Number(
        (((e.clientY - rect.top) / rect.height) * 100).toFixed(2)
      )

      onChange(set({ _type: 'mapCoordinates', x, y }))
    },
    [onChange]
  )

  // Same image used on the frontend MapView
  const MAP_IMAGE_URL = '/ayvalik-harita-final.png'

  const coords = value as { x?: number; y?: number } | undefined

  return (
    <Card padding={3} border radius={2} shadow={1}>
      <Text size={1} weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
        📍 Haritadan Konum Seç (Pin bırakmak için tıklayın)
      </Text>
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          cursor: 'crosshair',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MAP_IMAGE_URL}
          alt="Harita Seçici"
          style={{ width: '100%', display: 'block' }}
        />
        {coords?.x != null && coords?.y != null && (
          <div
            style={{
              position: 'absolute',
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              width: '16px',
              height: '16px',
              backgroundColor: '#ef4444',
              border: '2px solid white',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          />
        )}
      </div>
      {coords?.x != null && (
        <Text size={1} muted style={{ marginTop: '12px', display: 'block' }}>
          Kaydedilen Koordinat: X: {coords.x}% | Y: {coords.y}%
        </Text>
      )}
    </Card>
  )
}
