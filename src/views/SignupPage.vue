<template>
  <div>
    <form data-testid="signup-form" v-show="!signupSuccess">
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
          :disabled="isDisabledComputed || loading"
          @click="submit"
      >
        <span v-if="loading" role="status">Loading...</span>
        Sign Up
      </button>
    </form>
    <div v-show="signupSuccess">Please check your email to activate your account</div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "SignupPage",
  data() {
    return {
      loading: false,
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      signupSuccess: false
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
      this.loading = true;
      axios.post('/api/1.0/users', {
        username: this.username,
        email: this.email,
        password: this.password
      }).then(() => {
        this.signupSuccess = true;
      }).catch(() => {
        
      });

      // const reqBody = {
      //   username: this.username,
      //   email: this.email,
      //   password: this.password
      // }
      //
      // fetch("/api/1.0/users", {
      //   method: "POST",
      //   body: JSON.stringify(reqBody),
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // });
    }
  }
}
</script>

<style scoped>

</style>