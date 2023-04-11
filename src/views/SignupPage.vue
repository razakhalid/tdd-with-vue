<template>
  <div>
    <h1>Sign Up</h1>

    <label for="username">Username</label>
    <input id="username" type="text" name="username"/>

    <label for="email">E-mail</label>
    <input id="email" type="email" name="email" />

    <label
        for="password"
    >Password</label>
    <input
        id="password"
        type="password"
        name="password"
        @input="(event) => password = event.target.value"
    />

    <label for="password-repeat">Password Repeat</label>
    <input
        id="password-repeat"
        type="password"
        name="password-repeat"
        @input="(event) => passwordRepeat = event.target.value"
    />

    <button
        :disabled="isDisabledComputed"
    >Sign Up
    </button>
  </div>
</template>

<script>
export default {
  name: "SignupPage",
  data() {
    return {
      password: '',
      passwordRepeat: ''
    }
  },
  computed: {
    isDisabledComputed() {
      return !(this.password && this.passwordRepeat && this.password === this.passwordRepeat);
    }
  }
}
</script>

<style scoped>

</style>