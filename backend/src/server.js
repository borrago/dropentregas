import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from '../config/database.js';

import { User } from './models/User.js';
import { Vehicle } from './models/Vehicle.js';
import { Coupon } from './models/Coupon.js';
import { Order } from './models/Order.js';
import { OrderItem } from './models/OrderItem.js';
import './models/associations.js';

import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import couponRoutes from './routes/coupons.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * CORS
 * - Defina CORS_ORIGINS no .env com 1+ origens separadas por vírgula.
 *   Ex.: CORS_ORIGINS=https://appdrop.whizconnect.com.br
 *        CORS_ORIGINS=https://app1.dom,https://app2.dom
 */
const origins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Requests sem Origin (curl/postman) são permitidas
    if (!origin) return callback(null, true);
    if (origins.length === 0) return callback(null, true); // libera geral se não configurado
    const allowed = origins.includes(origin);
    return allowed ? callback(null, true) : callback(new Error('CORS: origin not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 86400, // cache do preflight (1 dia)
};

// Middleware básicos
app.disable('x-powered-by');
app.set('trust proxy', 1); // útil atrás do Traefik

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck simples (para o Docker/Traefik)
app.get('/health', (_req, res) => {
  res.type('text/plain').send('ok');
});

// Página inicial informativa
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'DropEntregas API',
    version: '1.0.0',
    environment: NODE_ENV,
    cors: origins.length ? origins : 'open',
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

// Handler de erro (inclui CORS se der erro por origem)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (err.message?.includes('CORS')) {
    res.setHeader('Vary', 'Origin');
  }
  if (NODE_ENV !== 'test') {
    console.error('❌ Error:', err.stack || err);
  }
  res.status(status).json({
    success: false,
    message: NODE_ENV === 'development' ? err.message : 'Algo deu errado!',
  });
});

// Seed opcional (controlado por env)
async function seed() {
  console.log('🌱 Seeding database...');
  const vehicles = [
    { name: 'Moto', basePrice: 20, defaultCoupon: 'MOTO10' },
    { name: 'Carro', basePrice: 50, defaultCoupon: 'CARRO15' },
    { name: 'Van', basePrice: 100, defaultCoupon: 'VAN20' },
    { name: 'Caminhão', basePrice: 200, defaultCoupon: 'CAMINHAO25' },
    { name: 'Ônibus', basePrice: 300, defaultCoupon: 'ONIBUS30' },
  ];
  for (const v of vehicles) {
    await Vehicle.findOrCreate({ where: { name: v.name }, defaults: v });
  }
  console.log('✅ Vehicles seeded');

  const coupons = [
    { code: 'MOTO10', kind: 'fixed', amount: 10 },
    { code: 'CARRO15', kind: 'percent', amount: 15 },
    { code: 'VAN20', kind: 'fixed', amount: 20 },
    { code: 'CAMINHAO25', kind: 'fixed', amount: 25 },
    { code: 'ONIBUS30', kind: 'fixed', amount: 30 },
  ];
  for (const c of coupons) {
    await Coupon.findOrCreate({ where: { code: c.code }, defaults: c });
  }
  console.log('✅ Coupons seeded');
}

async function startServer() {
  try {
    // Conexão DB
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync (sem destruir)
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database synchronized');

    if (String(process.env.SEED_ON_START).toLowerCase() === 'true') {
      await seed();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 DropEntregas API on http://0.0.0.0:${PORT}`);
      console.log(`📊 Env: ${NODE_ENV}`);
      console.log(
        `🌐 CORS: ${
          origins.length ? origins.join(', ') : 'open (configure CORS_ORIGINS)'
        }`,
      );
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
