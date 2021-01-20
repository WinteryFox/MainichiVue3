<template>
  <span class="dropdown-divider"/>
  <div class="box">
    <div class="is-flex">
      <router-link :to="`/users/${commenter.id}`" class="avatar mr-3">
        <AvatarComponent :avatar="commenter.avatar" size="59"/>
      </router-link>

      <div class="is-flex is-flex-direction-column details">
        <router-link :to="`/users/${commenter.id}`" class="is-flex user-row">
          <span class="username">{{ commenter.username }}</span>
          <span class="ml-2 time has-text-grey">· {{ date }}</span>
        </router-link>

        <div class="content" tabindex="0">{{ comment.content }}</div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import Comment from "@/interface/Comment";
import {useStore} from "vuex";
import {UserState} from "@/store";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";
import AvatarComponent from "@/components/AvatarComponent.vue";
import moment from "moment";

export default defineComponent({
  components: {
    AvatarComponent
  },

  props: {
    comment: {
      type: Object as PropType<Comment>,
      required: true
    }
  },

  async setup(props) {
    const store = useStore<UserState>()
    const commenter = computed<PartialUser | null>(() => store.state.users[props.comment.commenter])

    if (commenter.value == null)
      await store.dispatch(UserMutations.FETCH_USER_BATCH, props.comment.commenter)

    const time = Number(1609459200000n + (BigInt(props.comment.id) >> 22n))
    const date = ref(moment(time).fromNow(true))

    return {
      props,
      commenter,
      date
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"
.user-row
  z-index: 1

  .username
    color: $black
    font-weight: 800
    font-size: 18px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .time
    flex-shrink: 0
</style>