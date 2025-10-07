# 🚀 Próximos Pasos - Vota Flor

Esta guía te ayudará a empezar con el proyecto y prepararte para Hacktoberfest 2025.

---

## ✅ Checklist de Setup

### 1. Crear el Repositorio en GitHub

```bash
# En tu máquina local, crea la estructura del proyecto
mkdir vota-flor
cd vota-flor

# Inicializa git
git init

# Crea las carpetas principales
mkdir -p frontend/src/{components/{ui,layout,features},pages,services,hooks,utils,styles}
mkdir -p backend/src/{config,controllers,routes,middleware,schemas,utils}
mkdir -p backend/prisma
mkdir -p docs
mkdir -p .github/{ISSUE_TEMPLATE,workflows}
mkdir -p scripts

# Copia todos los archivos que he generado en cada carpeta correspondiente
# (Los artifacts que creé)
```

### 2. Configurar GitHub

```bash
# Crea un nuevo repo en GitHub llamado "vota-flor"
# Luego conecta tu repo local:

git remote add origin https://github.com/dev-night-talk/vota-flor.git
git add .
git commit -m "Add: initial project structure"
git push -u origin main
```

### 3. Configurar Supabase

1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Copia la `DATABASE_URL` desde Settings → Database
4. Copia las keys de API desde Settings → API

### 4. Instalar y Configurar Localmente

```bash
# Dale permisos al script de setup
chmod +x scripts/setup.sh

# Ejecuta el setup
./scripts/setup.sh

# O manualmente:
cd frontend && npm install && cp .env.example .env
cd ../backend && npm install && cp .env.example .env
```

### 5. Configurar Variables de Entorno

**frontend/.env:**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_APP_NAME=Vota Flor
```

**backend/.env:**
```bash
DATABASE_URL="postgresql://usuario:password@host:port/database"
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 6. Configurar Base de Datos

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar con datos de ejemplo
npm run prisma:seed
```

### 7. Probar que Todo Funcione

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Debería estar corriendo en http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Debería estar corriendo en http://localhost:3000

# Abre http://localhost:3000 en tu navegador
```

---

## 📝 Crear Issues Iniciales (20-25)

### Good First Issues (8-10)

1. **[UI] Agregar favicon y meta tags**
   - Archivos: `frontend/public/`, `frontend/index.html`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `frontend`

2. **[Docs] Mejorar README con badges**
   - Archivos: `README.md`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `documentation`

3. **[UI] Crear componente Loading spinner**
   - Archivos: `frontend/src/components/ui/Loading.jsx`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `frontend`

4. **[UI] Crear página 404 personalizada**
   - Archivos: `frontend/src/pages/NotFound.jsx`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `frontend`

5. **[Docs] Traducir README al inglés**
   - Archivos: `README.en.md`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `documentation`

6. **[UI] Agregar footer con links a redes sociales**
   - Archivos: `frontend/src/components/layout/Footer.jsx`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `frontend`

7. **[Docs] Crear CULTURAL_CONTEXT.md con historia del certamen**
   - Archivos: `docs/CULTURAL_CONTEXT.md`
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `documentation`

8. **[UI] Agregar animaciones de entrada a las páginas**
   - Archivos: CSS/Tailwind configs
   - Etiquetas: `good-first-issue`, `hacktoberfest`, `frontend`

### Intermediate Issues (8-10)

9. **[Feature] Implementar componente CandidateCard**
   - Archivos: `frontend/src/components/features/CandidateCard.jsx`
   - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`

10. **[Feature] Crear formulario de votación**
    - Archivos: `frontend/src/pages/Vote.jsx`, services
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`

11. **[Feature] Implementar página About con historia**
    - Archivos: `frontend/src/pages/About.jsx`
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`

12. **[API] Implementar endpoint GET /candidates**
    - Archivos: Backend controllers y routes
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`

13. **[API] Implementar endpoint POST /votes con validación**
    - Archivos: Backend controllers, schemas
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`

14. **[Feature] Dashboard de resultados básico**
    - Archivos: `frontend/src/pages/Results.jsx`
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`

15. **[API] Implementar endpoint GET /results**
    - Archivos: Backend controllers
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`

16. **[Feature] Sistema de validación de votos únicos por IP**
    - Archivos: Backend middleware
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`

### Advanced Issues (4-7)

17. **[Feature] Gráficas interactivas con Recharts**
    - Archivos: Frontend components
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`, `charts`

18. **[Feature] Panel de administración básico**
    - Archivos: Frontend + Backend
    - Etiquetas: `enhancement`, `hacktoberfest`, `full-stack`

19. **[Performance] Implementar caché de resultados**
    - Archivos: Backend + Prisma
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`, `performance`

20. **[DevOps] Setup de CI/CD con GitHub Actions**
    - Archivos: `.github/workflows/`
    - Etiquetas: `enhancement`, `hacktoberfest`, `devops`

21. **[Testing] Implementar tests unitarios para componentes**
    - Archivos: Frontend tests
    - Etiquetas: `enhancement`, `hacktoberfest`, `testing`

22. **[Feature] Sistema de compartir predicción en redes sociales**
    - Archivos: Frontend components
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`

23. **[Security] Implementar rate limiting avanzado**
    - Archivos: Backend middleware
    - Etiquetas: `enhancement`, `hacktoberfest`, `backend`, `security`

24. **[Feature] Modo oscuro**
    - Archivos: Frontend global
    - Etiquetas: `enhancement`, `hacktoberfest`, `frontend`, `ui`

25. **[Docs] Documentación completa de deployment**
    - Archivos: `docs/DEPLOYMENT.md`
    - Etiquetas: `documentation`, `hacktoberfest`

---

## 🎨 Personalización y Branding

### 1. Diseñar Logo

- Crear un logo inspirado en la Flor de Tabasco
- Formatos necesarios: SVG, PNG (varias resoluciones)
- Colores: Usar los definidos en `tailwind.config.js`

### 2. Crear Favicon

- Usar herramientas como https://realfavicongenerator.net
- Generar todos los tamaños necesarios
- Colocar en `frontend/public/`

### 3. Screenshots para README

- Capturar screenshots de:
  - Página de inicio
  - Formulario de votación
  - Dashboard de resultados
- Optimizar imágenes y colocar en `docs/screenshots/`

### 4. Banner para Redes Sociales

- Crear banner 1200x630px para compartir
- Incluir logo, título, y call-to-action
- Guardar en `docs/assets/`

---

## 📊 Datos de Ejemplo

### Crear Seed para Prisma

Crear `backend/prisma/seed.js` con datos de ejemplo:

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear evento
  const event = await prisma.event.create({
    data: {
      name: 'Flor de Tabasco 2025',
      description: 'Certamen anual para elegir la representante...',
      year: 2025,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-30'),
      votingStart: new Date('2025-04-01'),
      votingEnd: new Date('2025-04-25'),
      active: true,
    }
  })

  // Crear candidatas (datos de ejemplo)
  const municipalities = [
    'Centro', 'Cárdenas', 'Comalcalco', 'Huimanguillo',
    'Macuspana', 'Nacajuca', 'Paraíso', 'Tacotalpa',
    'Teapa', 'Jalpa de Méndez', 'Cunduacán', 'Balancán',
    'Centla', 'Emiliano Zapata', 'Jalapa', 'Jonuta', 'Tenosique'
  ]

  for (let i = 0; i < municipalities.length; i++) {
    await prisma.candidate.create({
      data: {
        eventId: event.id,
        name: `Embajadora ${municipalities[i]}`,
        municipality: municipalities[i],
        age: 20 + Math.floor(Math.random() * 5),
        bio: `Representante del municipio de ${municipalities[i]}...`,
        orderNumber: i + 1,
        active: true,
      }
    })
  }

  console.log('✅ Base de datos poblada con datos de ejemplo')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Conecta tu repo de GitHub a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push a `main`

### Backend (Render)

1. Crea un nuevo Web Service en Render
2. Conecta tu repo de GitHub
3. Configura:
   - Build Command: `cd backend && npm install && npm run prisma:generate`
   - Start Command: `cd backend && npm start`
4. Agrega variables de entorno

### Database (Supabase)

Ya configurado, solo asegúrate de:
- Tener backups automáticos habilitados
- Configurar políticas de seguridad (Row Level Security)

---

## 📢 Promoción para Hacktoberfest

### 1. Registrar el Evento

- Llenar formulario en https://organize.mlh.io/host/hacktoberfest-2025
- Usar la descripción que ya creamos

### 2. Agregar Topic "hacktoberfest"

```bash
# En GitHub, Settings → Topics
# Agregar: hacktoberfest, hacktoberfest2025, open-source, react, nodejs
```

### 3. Posts en Redes Sociales

Publicar el post que ya creamos:
- Twitter/X
- Facebook
- Instagram
- LinkedIn
- WhatsApp de la comunidad

### 4. Crear Flyer

Usar el texto que ya creamos para el flyer físico/digital

---

## 📅 Timeline Recomendado

### Semana 1 (Ahora - 1 semana antes del evento)
- [ ] Crear estructura completa del proyecto
- [ ] Configurar repositorio en GitHub
- [ ] Setup de Supabase
- [ ] Deployment inicial (puede ser parcial)
- [ ] Crear 25 issues documentados
- [ ] Agregar topic "hacktoberfest"

### Semana 2 (1 semana antes - día del evento)
- [ ] Implementar MVP funcional (aunque simple)
- [ ] Probar todo el flujo end-to-end
- [ ] Preparar materiales para el evento
- [ ] Promoción en redes sociales
- [ ] Confirmar asistentes

### Día del Evento (9 de Octubre)
- [ ] Presentación del proyecto
- [ ] Demo en vivo
- [ ] Ayudar a los asistentes con setup
- [ ] Hacer primeros PRs en vivo
- [ ] Celebrar contribuciones

### Post-Evento
- [ ] Revisar PRs pendientes
- [ ] Agradecer a contribuidores
- [ ] Continuar desarrollo
- [ ] Preparar para el certamen real 2026

---

## 🆘 Troubleshooting Común

### Error: Prisma Client no encontrado
```bash
cd backend
npm run prisma:generate
```

### Error: Puerto 3000 o 5000 en uso
```bash
# Cambiar puerto en .env o matar proceso
lsof -ti:3000 | xargs kill -9
```

### Error: Cannot connect to database
- Verificar DATABASE_URL en .env
- Verificar que Supabase esté activo
- Verificar reglas de firewall

### Frontend no carga datos del backend
- Verificar que backend esté corriendo
- Verificar CORS configuration
- Verificar VITE_API_URL en frontend/.env

---

## 📚 Recursos Adicionales

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Prisma Docs](https://prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Hacktoberfest Docs](https://hacktoberfest.com/participation/)

---

## ✅ Ready to Launch!

Una vez completados todos estos pasos, estarás listo para:
1. ✅ Abrir el proyecto al público
2. ✅ Recibir contribuciones de Hacktoberfest
3. ✅ Realizar tu evento el 9 de Octubre
4. ✅ Construir algo significativo para tu comunidad

**¡Éxito con Vota Flor y Hacktoberfest 2025! 🌺🚀**

---

*Si tienes preguntas, abre un issue o contacta a devnighttalk@gmail.com*