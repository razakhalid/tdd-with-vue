<template>
<!--  <router-view/>-->
  <div>
    <SignupPage></SignupPage>
    <LanguageSelector></LanguageSelector>
  </div>
</template>

<script>
import SignupPage from "@/views/SignupPage.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
export default {
  name: "App",
  components: {
    SignupPage,
    LanguageSelector
  }
}
</script>

<style lang="scss">
</style>
