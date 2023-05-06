<template>
  <div data-testid="login-page">
    <h1>Login</h1>

    <Input
        :label="$t('email')"
        id="email"
        v-model="email"
    ></Input>

    <Input
        :label="$t('password')"
        id="password"
        type="password"
        v-model="password"
    ></Input>

    <button
        @click.prevent="submit"
    >Login</button>
  </div>
</template>

<script>
import Input from "@/components/Input.vue";
export default {
  name: "LoginPage",
  data() {
    return {
      password: '',
      email: '',
      id: 5
    }
  },
  methods: {
    async submit() {
       this.$router.push('/');
       this.$store.commit('loginSuccess', {
         id: this.id
       });
    }
  },
  components: {
    Input
  }
}
</script>

<style scoped>

</style>