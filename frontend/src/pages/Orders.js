import { apiMyOrders } from "../api-client.js";

export default {
  template: `
  <h2>Meus Pedidos</h2>
  <div v-if="orders.length===0">Nenhum pedido ainda.</div>
  <div v-for="o in orders" :key="o.id" style="border:1px solid #ddd; padding:8px; margin-bottom:8px">
    <div><strong>ID:</strong> {{ o.id }}</div>
    <div><strong>Origem:</strong> {{ o.origin }} | <strong>Destino:</strong> {{ o.destination }}</div>
    <div><strong>Subtotal:</strong> R$ {{ o.subtotal.toFixed(2) }} | <strong>Desconto:</strong> R$ {{ o.discount.toFixed(2) }} | <strong>Total:</strong> R$ {{ o.total.toFixed(2) }}</div>
    <div><strong>Itens:</strong>
      <ul>
        <li v-for="it in o.items" :key="it.id">{{ it.qty }}x veículo #{{ it.VehicleId }} — R$ {{ it.lineTotal.toFixed(2) }}</li>
      </ul>
    </div>
  </div>
  `,
  data: () => ({ orders: [] }),
  async created() {
    this.orders = await apiMyOrders();
  }
}
