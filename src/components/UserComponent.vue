<template>
  <ModalComponent>
    <div class="card">
      <div class="card-content">

      </div>
    </div>
  </ModalComponent>
</template>

<script>
import {computed, defineComponent, reactive} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import ModalComponent from "@/components/ModalComponent.vue"
import {FETCH_USER} from "@/store/actions";

export default defineComponent({
  components: {
    ModalComponent
  },

  setup() {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      user: computed(() => store.state.users.get(route.params.snowflake))
    })

    store.dispatch(FETCH_USER, route.params.snowflake)

    return {
      state,
      close
    }
  }
})
</script>
