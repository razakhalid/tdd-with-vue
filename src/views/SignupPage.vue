<template>
  <div>
    <form data-testid="signup-form" v-show="!signupSuccess">
      <h1>{{ $t('signup') }}</h1>

      <Input
          :label="$t('username')"
          id="username"
          :help="errors && errors.username"
          @custom-input="onChangeUsername"
      ></Input>

      <Input
          :label="$t('email')"
          id="email"
          :help="errors && errors.email"
          @custom-input="onChangeEmail"
      ></Input>

      <Input
          :label="$t('password')"
          id="password"
          type="password"
          :help="errors && errors.password"
          @custom-input="onChangePassword"
      ></Input>

      <Input
          :label="$t('passwordRepeat')"
          id="password-repeat"
          type="password"
          :help="hasPasswordMismatch ? $t('passwordMismatch') : ''"
          @custom-input="onChangePasswordRepeat"
      ></Input>

      <button
          :disabled="isDisabledComputed || loading"
          @click="submit"
      >
        <span v-if="loading" role="status">{{ $t('loading') }}}</span>
        <span
            v-else
        >{{ $t('signup') }}</span>
      </button>
    </form>
    <div v-show="signupSuccess">Please check your email to activate your account</div>
  </div>
</template>

<script>
import axios from 'axios';
import Input from '../components/Input.vue';
import { signup } from '../api/api-calls';
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
        username: '',
        email: '',
        password: ''
      },
      disabled: true
    }
  },
  computed: {
    isDisabledComputed() {
      return !(this.password && this.passwordRepeat && this.password === this.passwordRepeat);
    },
    hasPasswordMismatch() {
      return this.password !== this.passwordRepeat;
    }
  },
  watch: {
    username() {
      delete this.errors.username;
    },
    email() {
      delete this.errors.email;
    },
    password() {
      delete this.errors.password;
    }
  },
  methods: {
    submit(evt) {
      evt.preventDefault();
      this.loading = true;
      signup({
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
    },
    onChangeEmail(email) {
      this.email = email;
    },
    onChangePassword(password) {
      this.password = password;
    },
    onChangePasswordRepeat(passwordRepeat) {
      this.passwordRepeat = passwordRepeat;
    }
  },
  components: {
    Input
  }
}
</script>

<style scoped>

</style>