<template>
  <div>
    <label :for="id">{{ label }}</label>
    <input
        id="username"
        type="text"
        name="username"
        @input="onChange"
        :class="{ 'is-invalid' : help }"
    />
    <span
        class="invalid-feedback"
    >{{ help }}</span>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    label: String,
    id: String,
    help: String
  },
  emits: ['custom-input'],
  methods: {
    onChange(evt) {
      this.$emit('custom-input', evt.target.value);
    }
  }
}
</script>

<style scoped>

</style>