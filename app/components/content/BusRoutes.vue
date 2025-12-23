<script setup lang="ts">
const { t } = useI18n()

const busRoutes = [
  { key: 'route1', id: '0100000100', icon: null },
  { key: 'route207', id: '0100020700', icon: null },
  { key: 'route254', id: '0100025400', icon: null },
  { key: 'route275', id: '0400027500', icon: null },
  { key: 'route672', id: '0100067200', icon: null },
  { key: 'route673', id: '0100067300', icon: null },
  { key: 'route707', id: '0400027510', icon: null },
  { key: 'route907', id: '0100090700', icon: null },
  { key: 'gr11', id: '0113001100', icon: null },
  { key: 'br12', id: '0114001200', icon: null },
  { key: 'keelungRd', id: '0161001500', icon: 'local:metro-bus' },
  { key: 'dunhua', id: '0161000500', icon: 'local:metro-bus' },
]
</script>

<template>
  <section class="flex flex-wrap gap-2">
    <NuxtLink
      v-for="route in busRoutes"
      :key="route.id"
      class="px-2 b b-gray-400 rounded inline-flex gap-1 items-center"
      :external="true"
      target="_blank"
      :to="`https://ebus.gov.taipei/Route/StopsOfRoute?routeid=${route.id}`"
    >
      <Icon
        v-if="route.icon"
        :name="route.icon"
      />
      {{ t(`busRoutes.${route.key}`) }}
    </NuxtLink>
  </section>
</template>

<i18n lang="yaml">
en:
  busRoutes:
    route1: "1"
    route207: "207"
    route254: "254"
    route275: "275"
    route672: "672"
    route673: "673"
    route707: "707"
    route907: "907"
    gr11: "G11"
    br12: "BR12"
    keelungRd: "Keelung Rd. Metro Bus"
    dunhua: "Dunhua Metro Bus"
zh:
  busRoutes:
    route1: "1"
    route207: "207"
    route254: "254"
    route275: "275"
    route672: "672"
    route673: "673"
    route707: "707"
    route907: "907"
    gr11: "綠 11"
    br12: "棕 12"
    keelungRd: "基隆路幹線"
    dunhua: "敦化幹線"
</i18n>
