# 🌺 Vota Flor - Inicio Rápido

Sistema de votación comunitaria para eventos culturales

---

## 🚀 Instalación en 3 Pasos

### Paso 1: Verifica que tienes Node.js
```bash
node --version
```

Si no tienes Node.js, descárgalo desde: **https://nodejs.org** (versión LTS)

---

### Paso 2: Instala el proyecto
```bash
./scripts/setup.sh
```

**¿Qué hace este script?**
- ✅ Instala todas las dependencias automáticamente
- ✅ Te guía para configurar la base de datos (Supabase o local)
- ✅ Crea los archivos de configuración necesarios
- ✅ Prepara todo para que funcione

**Durante la instalación te preguntará:**
1. ¿Qué base de datos usar? → Selecciona **Supabase** (opción 1, gratis)
2. Si eliges Supabase, necesitarás:
   - Ir a https://supabase.com
   - Crear cuenta gratis
   - Crear un proyecto
   - Copiar la "Connection String"

---

### Paso 3: Inicia el proyecto
```bash
./scripts/start-dev.sh
```

**¿Qué hace este script?**
- ✅ Inicia el servidor backend (API)
- ✅ Inicia la interfaz web (frontend)
- ✅ Abre automáticamente en los puertos correctos
- ✅ Muestra mensajes de estado claros

---

## 🌐 Acceder a la aplicación

Después de ejecutar `./scripts/start-dev.sh`, abre tu navegador en:

### 🎨 Interfaz de Votación (Frontend)
```
http://localhost:5173
```

### 🔧 API del Servidor (Backend)
```
http://localhost:5001
```

---

## 🛑 Detener los servicios

Para detener el frontend y backend, simplemente presiona:
```
Ctrl + C
```

---

## 📚 Documentación Completa

Si necesitas más detalles o quieres hacer una instalación manual:
- **Guía completa**: [`docs/SETUP_MULTITENANT.md`](docs/SETUP_MULTITENANT.md)
- **Contribuir**: [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## 🆘 ¿Problemas?

### El script setup.sh no funciona
```bash
# Dale permisos de ejecución:
chmod +x scripts/setup.sh
chmod +x scripts/start-dev.sh
```

### Error de base de datos
1. Verifica que tu `DATABASE_URL` esté correcta en `backend/.env`
2. Si usas Supabase, asegúrate de copiar la URL completa
3. Si usas PostgreSQL local, verifica que esté corriendo:
   ```bash
   # Mac/Linux
   pg_isready

   # Windows
   # Busca "PostgreSQL" en Servicios
   ```

### El puerto 5001 o 5173 ya está en uso
```bash
# Encuentra y detén el proceso:
# Mac/Linux
lsof -ti:5001 | xargs kill
lsof -ti:5173 | xargs kill

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Otros problemas
Consulta la sección **Troubleshooting** en [`docs/SETUP_MULTITENANT.md`](docs/SETUP_MULTITENANT.md)

---

## 🎯 ¿Qué hace cada script?

### `scripts/setup.sh`
Script de instalación único que:
- Verifica requisitos (Node.js)
- Instala dependencias del frontend y backend
- Configura la base de datos (con opciones guiadas)
- Crea archivos de configuración (.env)
- Ejecuta migraciones y seed de datos

### `scripts/start-dev.sh`
Script de inicio rápido que:
- Verifica que todo esté configurado
- Inicia backend en puerto 5001
- Inicia frontend en puerto 5173
- Maneja errores y muestra logs claros
- Limpia procesos al presionar Ctrl+C

---

## 📦 Estructura del Proyecto

```
ranked-vote/
├── backend/          # API del servidor (Node.js + Express + Prisma)
├── frontend/         # Interfaz web (React + Vite)
├── scripts/          # Scripts de ayuda
│   ├── setup.sh     # ← Instalación automática
│   └── start-dev.sh # ← Inicio rápido
└── docs/            # Documentación completa
```

---

## 🤝 Contribuir

Si quieres contribuir al proyecto, lee: [`CONTRIBUTING.md`](CONTRIBUTING.md)

---

## 📞 Ayuda

- **Issues**: [Reportar problema](https://github.com/dev-night-talk/vota-flor/issues)
- **Documentación**: [docs/](docs/)
- **Comunidad**: Dev Night Talk Villahermosa

---

**¡Gracias por usar Vota Flor! 🌺**
