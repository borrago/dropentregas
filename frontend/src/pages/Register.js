import { apiRegister } from "../api-client.js";
export default {
  template: `
  <h2>Cadastro</h2>
  <form @submit.prevent="onSubmit" style="display:grid;gap:8px;max-width:320px">
    <input v-model="name" placeholder="Nome" required />
    <input v-model="email" placeholder="Email" type="email" required />
    <input v-model="password" placeholder="Senha" type="password" required />
    <button>Cadastrar</button>
  </form>
  `,
  data: () => ({ name: "", email: "", password: "" }),
  methods: {
    async onSubmit() {
      try {
        await apiRegister({ name: this.name, email: this.email, password: this.password });
        this.$router.push("/");
      } catch (e) {
        alert(e.message);
      }
    }
  }
}
