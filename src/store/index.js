import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      isLoggedIn: false
    }
  },
  mutations: {
    loginSuccess(state, payload) {
      const { id } = payload;
      state.isLoggedIn = true;
      state.id = id;
    },
    reset(state) {
      state.isLoggedIn = false;
      delete state.id;
    }
  }
});

store.subscribe((mutation, state) => {
  localStorage.setItem('auth', JSON.stringify(state));
})

export const resetAuthState = function () {
  store.commit('reset');
}

export default store;