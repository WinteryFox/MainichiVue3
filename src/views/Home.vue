<template>
  <Header/>
  <Suspense>
    <template #default>
      <div>
        <Feed/>
        <router-view/>
      </div>
    </template>
    <template #fallback>
      <ModalComponent>
        <div class="loader-wrapper is-active">
          <div class="loader is-loading"/>
        </div>
      </ModalComponent>
    </template>
  </Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Feed from '@/views/Feed.vue';
import Header from "@/components/Header.vue";
import ModalComponent from "@/components/ModalComponent.vue";

export default defineComponent({
  name: 'Home',
  components: {
    ModalComponent,
    Feed,
    Header,
  },
});
</script>

<style lang="sass">
.loader-wrapper
  overflow: hidden
  top: 0
  left: 0
  width: 100%
  height: 100%
  transition: opacity .3s
  display: flex
  justify-content: center
  align-items: center
  opacity: 0
  z-index: -1

  .loader
    width: 80px
    height: 80px

  &.is-active
    opacity: 1
    z-index: 1
</style>
