<template>
  <div data-testid="activation-page">
    <h1 v-if="success">Account is activated</h1>
    <h1 v-if="fail">Activation failure</h1>
    <span v-if="loading" role="status">{{ $t('loading') }}}</span>
  </div>
</template>

<script>
import { activate } from '@/api/api-calls';
export default {
  name: "AccountActivation",
  data() {
    return {
      success: false,
      fail: false,
      loading: false
    }
  },
  mounted() {
    this.loading = true;
    activate(this.$route.params.token)
        .then(() => {
          this.success = true;
          this.loading = false;
        }).catch(err => {
          console.error(err);
          this.fail = true;
          this.loading = false;
    });
  }
}
</script>

<style scoped>

</style>