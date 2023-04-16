<template>
  <div>
    <span
        title="ol"
        @click="$i18n.locale = $i18n.locale === 'en' ? 'ol' : 'en'"
    >{{ $i18n.locale === 'en' ? 'OL' : 'EN' }}</span>
  </div>
</template>

<script>
export default {
  name: "LanguageSelector"
}
</script>

<style scoped>

</style>