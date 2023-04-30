<template>
<!--  <router-view/>-->
  <div>
    <router-link to="/">{{ $t('home') }}</router-link>
    <router-link to="/signup">{{ $t('signup') }}</router-link>
    <router-link to="/login">{{ $t('login') }}</router-link>
    <router-link to="/activate">{{ $t('activate') }}</router-link>

    <router-view></router-view>
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
    LanguageSelector
  }
}
</script>

<style lang="scss">
</style>
