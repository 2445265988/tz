<template>
  <baidu-map :center="center" :zoom="zoom" @ready="handler"></baidu-map>
</template>
<script>
export default {
  name: "map",
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3
    }
  },
  methods: {
    handler ({BMap, map}) {
      console.log(BMap, testmap)
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    }
  }
}
</script>

<style scoped>

</style>