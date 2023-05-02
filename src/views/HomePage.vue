<template>
  <div data-testid="home-page">
    <h1>Home</h1>

    <UserList></UserList>
  </div>
</template>

<script>
import UserList from "@/components/UserList.vue";
export default {
  name: "HomePage",
  components: {
    UserList
  }
}
</script>

<style scoped>

</style>