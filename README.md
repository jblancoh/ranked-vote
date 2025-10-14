# 🗳️ Ranked Vote

> Plataforma open-source de votación ranqueada para eventos y concursos comunitarios

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-orange.svg)](https://hacktoberfest.com)
[![PRs Bienvenidos](https://img.shields.io/badge/PRs-bienvenidos-brightgreen.svg)](docs/CONTRIBUTING.md)


Ranked Vote es una aplicación web moderna que permite a las comunidades organizar votaciones con ranking para cualquier tipo de evento o concurso. Ya sea que estés eligiendo el mejor platillo local, representante comunitario o símbolo cultural, Ranked Vote lo hace fácil y transparente.

Si deseas consultar la versión en inglés de esta documentación, puedes verla haciendo clic [aquí](README.en.md).

## ✨ Características

- 🎯 **Votación Ranqueada** - Los votantes ordenan sus 5 opciones favoritas por preferencia
- 📊 **Resultados en Tiempo Real** - Conteo de votos en vivo y visualización con gráficas interactivas
- 🔒 **Integridad del Voto** - Un voto por persona (basado en IP o verificación por email)
- 📱 **Diseño Responsivo** - Funciona perfectamente en escritorio, tablet y móvil
- 🎨 **Personalizable** - Fácil de adaptar para diferentes eventos y temas
- 🌐 **Soporte Multi-eventos** - Ejecuta múltiples campañas de votación simultáneamente
- 📈 **Dashboard de Analíticas** - Rastrea participación, tendencias y patrones de votación
- 🌍 **Bilingüe** - Soporte completo para inglés y español

## 🚀 Construido Con

**Frontend:**
- React 18 + Vite
- TailwindCSS
- React Router v6
- Recharts
- Lucide React Icons

**Backend:**
- Node.js + Express
- Prisma ORM
- Validación con Zod
- Rate limiting y seguridad

**Base de Datos:**
- Supabase (PostgreSQL)
- Autenticación
- Suscripciones en tiempo real

## 🎯 Casos de Uso

Esta plataforma fue creada por [Dev Night Talk](https://www.meetup.com/es-ES/dev-night-talks/) y se implementará por primera vez para el evento comunitario "Flor de Tabasco". Puede adaptarse para:

- 🌸 Selección de símbolos culturales
- 🍕 Concursos de mejor comida/restaurante local
- 🏆 Premios y reconocimientos comunitarios
- 📚 Selecciones de club de lectura
- 🎬 Votación de películas
- 🎨 Competencias de arte y diseño
- 🎵 Concursos de música o bandas
- ¡Y cualquier decisión que requiera ranking!

## 📖 Inicio Rápido

### 🎯 Instalación Automática (Recomendado)

La forma más fácil de empezar. Solo necesitas **Node.js 18+** instalado.

```bash
# 1. Clonar el repositorio
git clone https://github.com/jblancoh/ranked-vote.git
cd ranked-vote

# 2. Ejecutar instalación automática
./scripts/setup.sh
```

El script te guiará paso a paso para:
- ✅ Instalar todas las dependencias
- ✅ Configurar la base de datos (Supabase gratis o PostgreSQL local)
- ✅ Crear los archivos de configuración
- ✅ Preparar todo para funcionar

### 🚀 Iniciar el Proyecto

```bash
./scripts/start-dev.sh
```

¡Eso es todo! Abre tu navegador en:
- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:5001>

### 📚 Más Información

- **Documentación Completa**: [`SETUP_MULTITENANT.md`](docs/SETUP_MULTITENANT.md) - Detalles técnicos
- **Contribuir**: [`CONTRIBUTING.md`](docs/CONTRIBUTING.md) - Cómo colaborar

📁 Estructura del Proyecto
```
ranked-vote/
├── frontend/          # Aplicación React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── prisma/
│   └── package.json
├── shared/            # Tipos y utilidades compartidas
├── docs/              # Documentación
│   ├── INSTALLATION.md
│   └── examples/
│       └── flor-tabasco/
└── package.json       # Package raíz con scripts
```

🤝 Contribuir
¡Damos la bienvenida a contribuciones de desarrolladores de todos los niveles! Este proyecto es parte de Hacktoberfest 2025.
Cómo Contribuir

- Haz fork del repositorio
- Crea tu rama de feature (git checkout -b feature/CaracteristicaIncreible)
- Haz commit de tus cambios (git commit -m 'Agregar CaracteristicaIncreible')
- Push a la rama (git push origin feature/CaracteristicaIncreible)
- Abre un Pull Request

Revisa nuestra [Guía de Contribución](docs/CONTRIBUTING.md) para instrucciones detalladas.

Buenos Primeros Issues (Good First Issues)
¿Nuevo en open source? Busca issues etiquetados con:

good-first-issue - Perfecto para principiantes
hacktoberfest - Issues listos para Hacktoberfest
documentation - Ayuda a mejorar nuestra documentación
help-wanted - ¡Necesitamos tu experiencia!

🌟 Primera Implementación: Flor de Tabasco

Nuestro evento inaugural ayuda a la comunidad de Tabasco a predecir el ganador de su flor representativa a través de votación ranqueada democrática. Esta implementación real muestra las capacidades de la plataforma.

Conoce más: Caso de Estudio [Flor de Tabasco](docs/examples/flor-tabasco)

🚀 Despliegue
La aplicación puede desplegarse en:
Frontend:

Vercel (recomendado)
Netlify
GitHub Pages

Backend:

Render (tier gratuito)
Railway
Heroku

Base de Datos:

Supabase (tier gratuito)

<!-- Ver [Guía de Despliegue](docs/DEPLOYMENT.md) para instrucciones detalladas. -->

📄 Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
🙏 Agradecimientos

Creado por la comunidad [Dev Night Talk](https://www.meetup.com/es-ES/dev-night-talks/)
Agradecimiento especial a todos nuestros [contribuidores](https://github.com/jblancoh/ranked-vote/graphs/contributors)
Potenciado por tecnologías open-source

📞 Contacto y Comunidad

GitHub: [@jblancoh](https://github.com/jblancoh)
Issues: [Reporta un bug o solicita una función](https://github.com/jblancoh/ranked-vote/issues)

Comunidad: Dev Night Talk - Todos los jueves 7-10 PM

🗺️ Hoja de Ruta

- Verificación por email para votos
- Dashboard de administración
- Múltiples métodos de votación (ranqueada, aprobación, puntaje)
- Exportar resultados a PDF/CSV
- Internacionalización (más idiomas)
- App móvil (React Native)
- Compartir en redes sociales
- Fecha límite/programación de votación

❤️ Apoyo
Si encuentras útil este proyecto, por favor considera:

⭐ Dar una estrella al repositorio
🐛 Reportar bugs
💡 Sugerir nuevas características
🤝 Contribuir código
📢 Compartir con tu comunidad

Hecho con ❤️ por la comunidad Dev Night Talk en Villahermosa, Tabasco 🇲🇽
