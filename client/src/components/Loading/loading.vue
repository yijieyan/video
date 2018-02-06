<template>
  <div class="container_loading">
    <img src="../../assets/images/loading.svg" class="loading"/>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .container_loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, .5);
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -100px;
    }
  }
</style>
