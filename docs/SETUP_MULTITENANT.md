# 🚀 Guía de Instalación - Ranked Vote

Esta guía te ayudará a instalar y configurar Ranked Vote **paso a paso**, de la forma más simple posible.

---

## 🎯 Instalación Rápida (Recomendado)

Si solo quieres instalar y usar el proyecto **sin complicaciones**:

### 1. Descarga el proyecto
```bash
# Si tienes Git instalado:
git clone <url-del-repositorio>
cd ranked-vote

# Si descargaste el ZIP:
# Descomprime el archivo y abre la carpeta en tu terminal
```

### 2. Ejecuta el script de instalación
```bash
./scripts/setup.sh
```

Este script hará **TODO** automáticamente:
- ✅ Verificará que tienes Node.js instalado
- ✅ Instalará todas las dependencias
- ✅ Te guiará para configurar la base de datos
- ✅ Creará los archivos de configuración necesarios

### 3. Inicia el proyecto
```bash
./scripts/start-dev.sh
```

### 4. Abre tu navegador
```
http://localhost:5173
```

**¡Eso es todo!** 🎉

---

## 📝 Requisitos Previos

Antes de comenzar, necesitas tener instalado:

- **Node.js** v18 o superior → [Descargar aquí](https://nodejs.org/) (versión LTS recomendada)
- **Base de datos PostgreSQL** → Usa una de estas opciones:
  - **Supabase** (gratis, en la nube, **recomendado**) → [Crear cuenta gratis](https://supabase.com)
  - **PostgreSQL local** (si ya lo tienes instalado)

### ¿Cómo verificar si tengo Node.js?
```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 9.x.x o superior
```

Si no aparece nada, descarga Node.js desde: https://nodejs.org

---

## 🗄️ Preparar la Base de Datos

### **Opción A: Crear base de datos con PostgreSQL local**

1. **Abrir terminal de PostgreSQL:**
   ```bash
   # En Mac/Linux:
   psql -U postgres

   # En Windows (usar terminal de PostgreSQL desde el menú inicio)
   psql -U postgres
   ```

2. **Crear la base de datos:**
   ```sql
   CREATE DATABASE ranked_vote;
   \q
   ```

3. **Tu URL de conexión será:**
   ```
   postgresql://postgres:tu_password@localhost:5432/ranked_vote
   ```
   Reemplaza `tu_password` con la contraseña de tu usuario postgres.

### **Opción B: Usar Supabase (Cloud PostgreSQL gratis)**

1. Ir a [supabase.com](https://supabase.com) y crear cuenta
2. Crear nuevo proyecto
3. Ir a Settings → Database
4. Copiar la "Connection String" (modo URI)
5. Usar esa URL en el siguiente paso

---

## ✅ Lo que ya está listo

- ✅ Schema de Prisma actualizado (con Tenant, User, tenantId en todas las tablas)
- ✅ Middleware de tenant (`tenant.vercel.js`)
- ✅ Helper de Prisma con aislamiento automático
- ✅ Seed script para crear tenant default
- ✅ `app.js` configurado con middleware
- ✅ `.env.example` actualizado

---

## 📋 Pasos para Ejecutar (En Orden)

### **1. Instalar dependencias**

```bash
cd backend
npm install
```

Esto instalará todos los paquetes necesarios (Express, Prisma, etc.)

### **2. Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

**Edita el archivo `.env`** con tu editor de texto favorito y configura:

```bash
# Database - IMPORTANTE: Usar TU URL de conexión
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/ranked_vote"

# Server
PORT=5001
NODE_ENV=development

# CORS - URL del frontend
CORS_ORIGIN=http://localhost:5173

# Multi-Tenant
DEFAULT_TENANT=default

# JWT (cambiar en producción)
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:** Asegúrate de:
- Cambiar `tu_password` por tu contraseña real de PostgreSQL
- Si usas Supabase, pega la URL completa de conexión

### **3. Resetear Base de Datos (Empezar de Cero)**

```bash
# Borrar migraciones viejas
rm -rf prisma/migrations

# Reset completo de la BD
npx prisma migrate reset --force
```

Esto:
- ❌ Borra TODA la data existente
- ❌ Elimina todas las tablas
- ✅ Te pregunta confirmación

### **4. Crear Migración Multi-Tenant**

```bash
npx prisma migrate dev --name init_multitenant
```

Esto crea:
- ✅ Tabla `tenants`
- ✅ Tabla `users` (para admins)
- ✅ Tablas `candidates`, `votes`, `events`, `results` con `tenantId`
- ✅ Todos los índices y relaciones

### **5. Ejecutar Seed (Crear Tenant Default + Data)**

```bash
npm run seed
```

**Output esperado:**
```
🌱 Starting seed...

📦 Creating default tenant...
✅ Created tenant: Flor de Tabasco 2026 (default)

🔄 Checking for existing data to migrate...
ℹ️  No existing data (fresh install).

📝 Creating sample candidates...
✅ Created 17 sample candidates

📅 Creating default event...
✅ Created default event

📊 Final Summary:
  Tenant: Flor de Tabasco 2026
  Candidates: 17
  Votes: 0
  Events: 1

🎉 Seed completed successfully!
```

### **6. Iniciar el Servidor**

```bash
npm run dev
```

**Output esperado:**
```
🗳️  Ranked Vote API Server (Multi-Tenant)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment: development
Server running on: http://localhost:5001
Health check: http://localhost:5001/health
API Base URL: http://localhost:5001/api
Default Tenant: default
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Multi-tenant enabled!
Use header: X-Tenant-Slug: default
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **7. Probar el API**

```bash
# Health check (no requiere tenant)
curl http://localhost:5001/health

# Get candidates (requiere tenant)
curl -H "X-Tenant-Slug: default" http://localhost:5001/api/candidates
```

**Respuesta esperada:**
```json
{
  "success": true,
  "count": 17,
  "data": [
    {
      "id": "...",
      "tenantId": "...",
      "name": "Embajadora Centro",
      "municipality": "Centro",
      ...
    }
  ]
}
```

---

## 🎨 Configurar el Frontend

El frontend **NO requiere cambios** para funcionar con el sistema multi-tenant. El backend automáticamente usa el tenant "default" cuando accedes desde `localhost`.

### Verificar que funciona:

1. **Iniciar el frontend:**
   ```bash
   cd frontend
   npm install  # Si no lo has hecho antes
   npm run dev
   ```

2. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```
   (depende de tu configuración)

3. **Deberías ver:**
   - Lista de 17 candidatas
   - Poder votar normalmente
   - Todas las funciones trabajando

### (Opcional) Agregar header explícito:

Si quieres ser explícito sobre el tenant, puedes modificar el archivo de configuración del frontend:

```javascript
// frontend/src/services/api.js (o similar)
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'X-Tenant-Slug': 'default'
  }
});
```

---

## 🔧 Actualizar Controllers (IMPORTANTE - Ya está hecho)

**✅ Buenas noticias:** Los controllers ya están actualizados para multi-tenant.

Todos los controllers ahora usan:
```javascript
import { getPrisma } from '../utils/prisma.js';

export const getAllCandidates = async (req, res, next) => {
  const prisma = getPrisma(req.tenantId); // Automáticamente filtra por tenant
  const candidates = await prisma.candidate.findMany();
  ...
};
```

**Controllers actualizados:**
- ✅ `candidates.controller.js`
- ✅ `votes.controller.js`
- ✅ `events.controller.js`
- ✅ `results.controller.js`

**No necesitas hacer nada adicional.**

---

## ✅ Verificación

### Verificar que el tenant existe:
```bash
npx prisma studio
```

En Prisma Studio:
1. Ir a tabla `Tenant`
2. Deberías ver el tenant "default"

### Verificar que las candidatas tienen tenantId:
```bash
npx prisma studio
```

1. Ir a tabla `Candidate`
2. Todas deberían tener un `tenantId`

---

## 🌟 ¿Qué cambió?

### Antes (Single-Tenant):
```javascript
// Cualquiera podía ver todas las candidatas
const candidates = await prisma.candidate.findMany();
```

### Ahora (Multi-Tenant):
```javascript
// Solo ve candidatas de SU tenant
const prisma = getPrisma(req.tenantId);
const candidates = await prisma.candidate.findMany();
// Automáticamente filtra por tenantId
```

### Frontend:
**No necesita cambios** por ahora. El backend usa "default" automáticamente.

Opcionalmente, puedes agregar el header:
```javascript
// frontend/src/services/api.js
headers: {
  'X-Tenant-Slug': 'default'
}
```

---

## 🎯 Siguientes Pasos

1. **Para el Evento**: Todo funcionará igual con el tenant "default"
2. **Después del Evento**: Podrás crear más tenants para otros eventos
3. **Panel Admin** (futuro): Gestionar múltiples tenants desde UI

---

## ⚡ Comandos Útiles

### Iniciar el proyecto (después de la instalación)
```bash
./scripts/start-dev.sh
```

Este comando:
- ✅ Inicia el backend (servidor API)
- ✅ Inicia el frontend (interfaz web)
- ✅ Abre automáticamente en los puertos correctos
- ✅ Muestra mensajes claros de estado
- ✅ Detiene ambos servicios al presionar Ctrl+C

### Ver la base de datos (visual)
```bash
cd backend
npx prisma studio
```
Abre una interfaz visual en http://localhost:5555 para ver y editar datos.

### Agregar más datos de ejemplo
```bash
cd backend
npm run prisma:seed
```

### Reiniciar la base de datos (¡CUIDADO! borra todo)
```bash
cd backend
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

### Error: "Tenant not found" o "No active tenant found for identifier: localhost:5001"

**Causa:** El middleware de tenant no puede encontrar el tenant "default"

**Solución:**
```bash
# 1. Verificar que existe el tenant
npx prisma studio
# Ir a tabla "tenants" y buscar tenant con slug "default"

# 2. Si no existe, ejecutar seed de nuevo
npm run prisma:seed

# 3. Verificar el .env
cat .env | grep DEFAULT_TENANT
# Debe mostrar: DEFAULT_TENANT=default
```

### Error: "Cannot find module './utils/prisma.js'"

**Causa:** Falta el archivo de utilidades de Prisma

**Solución:**
```bash
# Verificar que el archivo existe
ls src/utils/prisma.js

# Si no existe, asegúrate de tener la última versión del código
git pull origin main
```

### Error: "Connection refused" o "ECONNREFUSED"

**Causa:** PostgreSQL no está corriendo o la URL de conexión es incorrecta

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
# Mac/Linux:
pg_isready

# Windows:
# Buscar "PostgreSQL" en Servicios

# Verificar la URL en .env
cat .env | grep DATABASE_URL
# Asegúrate que el puerto, usuario y password sean correctos
```

### Error: "Unique constraint failed on the fields: (`tenantId`,`voterIp`)"

**Causa:** Ya votaste desde esa IP con ese tenant

**Solución (solo desarrollo):**
```bash
# Borrar votos existentes
npx prisma studio
# Ir a tabla "votes" y eliminar el voto con tu IP
```

### Error: "prisma:seed script not found"

**Causa:** Falta el script en package.json

**Solución:**
```bash
# Verificar que package.json tiene el script
grep "seed" package.json

# Si no existe, agregar en la sección "scripts":
# "prisma:seed": "node prisma/seed.js"
```

### Frontend muestra "Network Error" o "Failed to fetch"

**Causa:** Backend no está corriendo o CORS mal configurado

**Solución:**
```bash
# 1. Verificar que el backend está corriendo
curl http://localhost:5001/health

# 2. Verificar CORS en .env
cat .env | grep CORS_ORIGIN
# Debe coincidir con la URL del frontend (ej: http://localhost:5173)

# 3. Reiniciar el backend después de cambiar .env
```

---

## 📞 Ayuda

### ¿Algo no funciona?

1. **Verifica los logs del servidor** - Los errores aparecen en la terminal donde corriste `npm run dev`
2. **Revisa el .env** - Asegúrate que todos los valores sean correctos
3. **Ejecuta el seed de nuevo** - `npm run prisma:seed`
4. **Verifica la base de datos** - `npx prisma studio`
5. **Revisa el schema** - `cat prisma/schema.prisma | grep "model Tenant"`

### ¿Necesitas ayuda adicional?

- 📧 Abre un issue en GitHub
- 💬 Consulta la documentación en `/docs`
- 🔍 Busca en los logs específicos del error

