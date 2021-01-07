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

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
