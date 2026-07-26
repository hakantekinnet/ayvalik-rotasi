'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { set, unset, type ObjectInputProps } from 'sanity'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon paths for Leaflet in bundled environments
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface GeopointValue {
  _type: 'geopoint'
  lat: number
  lng: number
  alt?: number
}

export function LeafletGeopointInput(props: ObjectInputProps) {
  const { onChange, value, schemaType } = props
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isReady, setIsReady] = useState(false)

  const currentValue = value as GeopointValue | undefined

  // Default to Ayvalık center
  const defaultLat = 39.3193
  const defaultLng = 26.6961

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onChange(
        set({
          _type: 'geopoint',
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        })
      )
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    onChange(unset())
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }, [onChange])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const lat = currentValue?.lat ?? defaultLat
    const lng = currentValue?.lng ?? defaultLng

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    if (currentValue?.lat && currentValue?.lng) {
      markerRef.current = L.marker([currentValue.lat, currentValue.lng], {
        icon: defaultIcon,
        draggable: true,
      }).addTo(map)

      markerRef.current.on('dragend', () => {
        const pos = markerRef.current?.getLatLng()
        if (pos) handleMapClick(pos.lat, pos.lng)
      })
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng

      if (markerRef.current) {
        markerRef.current.setLatLng([clickLat, clickLng])
      } else {
        markerRef.current = L.marker([clickLat, clickLng], {
          icon: defaultIcon,
          draggable: true,
        }).addTo(map)

        markerRef.current.on('dragend', () => {
          const pos = markerRef.current?.getLatLng()
          if (pos) handleMapClick(pos.lat, pos.lng)
        })
      }

      handleMapClick(clickLat, clickLng)
    })

    mapRef.current = map
    setIsReady(true)

    // Ensure proper sizing after render
    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#2a2a2e',
        }}
      >
        {schemaType.title || 'Konum'}
      </label>

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          border: '1px solid #e0e0e5',
          overflow: 'hidden',
        }}
      />

      {currentValue?.lat && currentValue?.lng && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: '#f3f3f6',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#555',
          }}
        >
          <span>
            📍 {currentValue.lat.toFixed(6)}, {currentValue.lng.toFixed(6)}
          </span>
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Temizle
          </button>
        </div>
      )}

      {!currentValue?.lat && (
        <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
          Haritaya tıklayarak bir konum seçin.
        </p>
      )}
    </div>
  )
}
