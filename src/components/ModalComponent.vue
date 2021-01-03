<template>
  <div class="modal is-active">
    <div class="modal-background" @click="$emit('close')"/>
    <div class="modal-content">
      <slot/>
    </div>
    <button
        class="modal-close is-large"
        aria-label="close"
        @click="$emit('close')"/>
  </div>
</template>
