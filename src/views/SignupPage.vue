<template>
  <form>
    <h1>Sign Up</h1>

    <label for="username">Username</label>
    <input id="username" type="text" name="username" v-model="username"/>

    <label for="email">E-mail</label>
    <input id="email" type="email" name="email" v-model="email"/>

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
        @click="submit"
    >
      Sign Up
    </button>
  </form>
</template>

<script>
import axios from 'axios';
export default {
  name: "SignupPage",
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  },
  computed: {
    isDisabledComputed() {
      return !(this.password && this.passwordRepeat && this.password === this.passwordRepeat);
    }
  },
  methods: {
    submit(evt) {
      evt.preventDefault();
      // axios.post('/api/1.0/users', {
      //   username: this.username,
      //   email: this.email,
      //   password: this.password
      // });

      const reqBody = {
        username: this.username,
        email: this.email,
        password: this.password
      }

      fetch("/api/1.0/users", {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  }
}
</script>

<style scoped>

</style>