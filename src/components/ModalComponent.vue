<template>
  <div class="modal is-active">
    <div class="modal-background"/>
    <div class="modal-content">
      <slot/>
    </div>
    <button
        class="modal-close is-large"
        aria-label="close"
        @click="close"/>
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  setup() {
    const router = useRouter()

    function close() {
      router.back()
    }

    return {
      close
    }
  }
}
</script>
