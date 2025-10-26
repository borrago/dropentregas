import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import Dashboard from "./pages/Dashboard.vue";
import Vehicles from "./pages/Vehicles.vue";
import Cart from "./pages/Cart.vue";
import Orders from "./pages/Orders.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  { path: "/dashboard", component: Dashboard, name: "dashboard" },
  { path: "/vehicles", component: Vehicles, name: "vehicles" },
  { path: "/cart", component: Cart, name: "cart" },
  { path: "/orders", component: Orders, name: "orders" }
];

const router = createRouter({ 
  history: createWebHistory(), 
  routes 
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");