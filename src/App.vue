<template>
  <Suspense>
    <template #default>
      <router-view/>
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<style lang="sass">
@import "~@/assets/main.sass"

#app
  font-family: 'Roboto', sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background-color: $white-bis
</style>
