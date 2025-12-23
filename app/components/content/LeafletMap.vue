<script setup lang="ts">
import type { GeoJsonObject } from 'geojson'
import buildingGeometries from '~/assets/building-geometries.json'
import venueGeometry from '~/assets/venue-geometry.json'
import 'leaflet/dist/leaflet.css'

const { t } = useI18n()

const mapEl = ref<HTMLDivElement>()

onMounted(async () => {
  const Leaflet = await import('leaflet')
  const map = Leaflet.map(mapEl.value!)

  Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ${t('attribution.contributors')}`,
  }).addTo(map)

  Leaflet.geoJSON(buildingGeometries as GeoJsonObject, {
    onEachFeature: (feature, layer) => {
      const { name, ref } = feature.properties
      layer.bindTooltip(`${name} (${ref})`)
    },
  }).addTo(map)

  const venue = Leaflet.geoJSON(venueGeometry as GeoJsonObject)
  map.fitBounds(venue.getBounds())
  map.zoomIn()
})
</script>

<template>
  <div
    ref="mapEl"
    class="h-100"
  />
</template>

<i18n lang="yaml">
en:
  attribution:
    contributors: "Contributors"
zh:
  attribution:
    contributors: "貢獻者"
</i18n>
