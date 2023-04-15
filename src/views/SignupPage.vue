<template>
  <div>
    <form data-testid="signup-form" v-show="!signupSuccess">
      <h1>Sign Up</h1>

      <Input
          label="Username"
          id="username"
          :help="errors && errors.username"
          @custom-input="onChangeUsername"
      ></Input>

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
        <span
            v-else
        >Sign Up</span>
      </button>
    </form>
    <div v-show="signupSuccess">Please check your email to activate your account</div>
  </div>
</template>

<script>
import axios from 'axios';
import Input from '../components/Input.vue';
export default {
  name: "SignupPage",
  data() {
    return {
      loading: false,
      username: '',
      email: '',
      password: '',
      passwordRepeat: '',
      signupSuccess: false,
      errors: {
        username: ''
      },
      disabled: true
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
      }).catch(err => {
        if (err.response.status === 400) this.errors = err.response.data.validationErrors;
        this.loading = false;
        this.disabled = false;
      });
    },
    onChangeUsername(username) {
      this.username = username;
    }
  },
  components: {
    Input
  }
}
</script>

<style scoped>

</style>