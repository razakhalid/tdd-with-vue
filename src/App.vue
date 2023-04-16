<template>
<!--  <router-view/>-->
  <div>
    <HomePage v-if="path === '/'"></HomePage>
    <SignupPage v-else-if="path === '/signup'"></SignupPage>
    <LoginPage v-else-if="path === '/login'"></LoginPage>
    <UserPage v-else-if="path.startsWith('/user/')"></UserPage>
    <LanguageSelector></LanguageSelector>
  </div>
</template>

<script>
import SignupPage from "@/views/SignupPage.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import UserPage from "@/views/UserPage.vue";
export default {
  name: "App",
  computed: {
    path: () => window.location.pathname
  },
  components: {
    SignupPage,
    LanguageSelector,
    HomePage,
    LoginPage,
    UserPage
  }
}
</script>

<style lang="scss">
</style>
