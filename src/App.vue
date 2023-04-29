<template>
<!--  <router-view/>-->
  <div>
    <a @click.prevent="onClickLink" href="/" title="Home">{{ $t('home') }}</a>
    <a @click.prevent="onClickLink" href="/signup">{{ $t('signup') }}</a>

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
  data() {
    return {
      path: window.location.pathname
    }
  },
  methods: {
    onClickLink(evt) {
      this.path = evt.target.attributes.href.value;
      window.history.pushState({}, "", this.path);
    }
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
