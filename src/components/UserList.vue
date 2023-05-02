<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3>Users</h3>
      </div>
      <ul>
        <li
            v-for="user in page.content"
        >
        {{ user.username }}
      </li>
      </ul>

      <button
          @click="loadPrevious"
          v-if="page.page !== 0"
      >
        &lt previous
      </button>

      <button
          @click="loadNext"
          v-if="page.totalPages > page.page + 1"
      >next ></button>
    </div>
  </div>
</template>

<script>
import { loadUsers } from "@/api/api-calls";

export default {
  name: "UserList",
  data() {
    return {
      page: {
        content: [],
        page: 0,
        size: 0,
        totalPages: 0
      }
    }
  },
  async mounted() {
    try {
      const response = await loadUsers();
      this.page = response.data;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    async loadNext() {
      const response = await loadUsers(this.page.page + 1, this.page.size);
      this.page = response.data;
    },
    async loadPrevious() {
      const response = await loadUsers(this.page.page - 1, this.page.size);
      this.page = response.data;
    }
  }
}
</script>

<style scoped>

</style>