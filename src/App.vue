<template>
  <div style="display: flex;">
    <div ref="a" style="width: 200px; height: 400px;" id="content">
      <h1>h1</h1>
      <h2>h2</h2>
      <h2>h2</h2>
      <h3>h3 h3</h3>
      <h1>h1</h1>
    </div>
    <div style="position: fixed; top: 0; right: 100px;"><catalog content="#content" max-height="200px" /></div>
  </div>
</template>

<script>
import Catalog from './Catalog'

export default {
  components: {
    Catalog,
  },
}
</script>
