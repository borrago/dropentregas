import { apiPrice, apiCreateOrder } from "../api-client.js";

export default {
  template: `
  <h2>Carrinho</h2>
  <div v-if="items.length===0">Seu carrinho está vazio.</div>
  <table v-else border="1" cellpadding="6" cellspacing="0">
    <thead><tr><th>Veículo</th><th>Qtd</th><th>Unitário</th><th>Total</th><th></th></tr></thead>
    <tbody>
      <tr v-for="(it,idx) in items" :key="it.vehicleId">
        <td>{{ it.name }}</td>
        <td><input type="number" v-model.number="it.qty" min="1" style="width:60px"/></td>
        <td>R$ {{ it.unitPrice.toFixed(2) }}</td>
        <td>R$ {{ (it.unitPrice * it.qty).toFixed(2) }}</td>
        <td><button @click="remove(idx)">Remover</button></td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top:12px;display:grid;gap:8px;max-width:420px">
    <input v-model="coupon" placeholder="Cupom (opcional)"/>
    <input v-model="origin" placeholder="Origem"/>
    <input v-model="destination" placeholder="Destino"/>
    <button @click="calc">Calcular</button>
    <div v-if="preview">
      <strong>Subtotal:</strong> R$ {{ preview.subtotal.toFixed(2) }}<br/>
      <strong>Desconto:</strong> R$ {{ preview.discount.toFixed(2) }}<br/>
      <strong>Total:</strong> R$ {{ preview.total.toFixed(2) }}
    </div>
    <button :disabled="!preview" @click="checkout">Finalizar Pedido</button>
  </div>
  `,
  data() {
    const s = this.$state;
    return {
      items: s.cart,
      coupon: s.coupon,
      origin: s.origin,
      destination: s.destination,
      preview: null
    }
  },
  methods: {
    remove(idx) { this.items.splice(idx,1); },
    async calc() {
      const payload = { items: this.items.map(i=>({ vehicleId: i.vehicleId, qty: i.qty })), couponCode: this.coupon };
      this.preview = await apiPrice(payload);
    },
    async checkout() {
      try {
        const order = await apiCreateOrder({
          items: this.items.map(i=>({ vehicleId: i.vehicleId, qty: i.qty })),
          couponCode: this.coupon,
          origin: this.origin,
          destination: this.destination
        });
        alert("Pedido criado: " + order.id);
        // limpa o estado global
        this.$state.cart = [];
        this.$router.push("/orders");
      } catch (e) {
        alert(e.message);
      }
    }
  }
}
