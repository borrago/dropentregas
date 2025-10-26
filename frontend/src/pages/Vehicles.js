import { apiVehicles } from "../api-client.js";

export default {
  template: `
  <h2>Veículos</h2>
  <div style="display:flex; gap:12px; flex-wrap:wrap;">
    <div v-for="v in vehicles" :key="v.id" style="border:1px solid #ddd; padding:12px; border-radius:8px; width:180px;">
      <h3 style="margin:0 0 8px;">{{ v.name }}</h3>
      <div>R$ {{ v.basePrice.toFixed(2) }}</div>
      <button @click="addToCart(v)">Adicionar</button>
    </div>
  </div>
  `,
  data: () => ({ vehicles: [] }),
  async created() {
    this.vehicles = await apiVehicles();
  },
  methods: {
    addToCart(v) {
      const s = this.$state;
      const found = s.cart.find(it => it.vehicleId === v.id);
      if (found) { found.qty += 1; } else { s.cart.push({ vehicleId: v.id, name: v.name, unitPrice: v.basePrice, qty: 1 }); }
      alert("Adicionado ao carrinho");
    }
  }
}
