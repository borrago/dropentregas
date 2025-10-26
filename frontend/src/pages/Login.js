import { apiLogin } from "../api-client.js";
export default {
  template: `
  <h2>Login</h2>
  <form @submit.prevent="onSubmit" style="display:grid;gap:8px;max-width:320px">
    <input v-model="email" placeholder="Email" type="email" required />
    <input v-model="password" placeholder="Senha" type="password" required />
    <button>Entrar</button>
  </form>
  `,
  data: () => ({ email: "", password: "" }),
  methods: {
    async onSubmit() {
      try {
        await apiLogin({ email: this.email, password: this.password });
        this.$router.push("/");
      } catch (e) {
        alert(e.message);
      }
    }
  }
}
