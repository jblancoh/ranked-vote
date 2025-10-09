# 🤝 Guía de Contribución - Ranked Vote

¡Gracias por tu interés en contribuir a Ranked Vote! Este proyecto celebra la cultura de Tabasco mientras ayudamos a digitalizar tradiciones locales. Cada contribución, grande o pequeña, hace la diferencia.

> 🎃 **Hacktoberfest 2025**: Este proyecto participa en Hacktoberfest. ¡Buscamos contribuyentes de todos los niveles!

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración del Proyecto](#configuración-del-proyecto)
- [Proceso de Contribución](#proceso-de-contribución)
- [Guías de Estilo](#guías-de-estilo)
- [Convenciones de Commits](#convenciones-de-commits)
- [Pull Request Checklist](#pull-request-checklist)

---

## 📜 Código de Conducta

Este proyecto y todos los participantes están gobernados por nuestro [Código de Conducta](code_of_conduct.md). Al participar, se espera que mantengas este código. Por favor reporta comportamiento inaceptable a jblancoh26@gmail.com.

---

## 🌟 ¿Cómo Puedo Contribuir?

### 1. 💻 Contribuciones de Código

#### Para Principiantes
- Corregir typos en documentación
- Mejorar mensajes de error
- Agregar comentarios al código
- Crear componentes UI simples
- Mejorar estilos CSS/Tailwind

#### Para Intermedios
- Implementar nuevas features
- Corregir bugs
- Optimizar queries de base de datos
- Agregar validaciones
- Mejorar accesibilidad

#### Para Avanzados
- Arquitectura y refactorización
- Optimización de performance
- Implementar testing
- CI/CD improvements
- Features complejas

### 2. 🎨 Contribuciones de Diseño

- Crear mockups de nuevas features
- Diseñar iconografía
- Mejorar UX/UI
- Crear guías de estilo visual
- Diseñar assets para redes sociales

### 3. 📝 Contribuciones de Documentación

- Escribir tutoriales
- Mejorar documentación existente
- Traducir al inglés
- Crear videos explicativos
- Documentar casos de uso

### 4. 📊 Contribuciones de Contenido Cultural

- Agregar historia del certamen
- Documentar tradiciones
- Recopilar datos históricos
- Entrevistar participantes
- Crear línea de tiempo del evento

### 5. 🧪 Contribuciones de Testing

- Escribir tests unitarios
- Crear tests de integración
- Realizar testing manual
- Reportar bugs
- Validar features

---

## 🚀 Configuración del Proyecto

### Prerequisitos

- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **Git** (para clonar el repositorio)
- **Base de datos PostgreSQL**:
  - **Opción 1 (Recomendada)**: Cuenta de Supabase gratuita ([Crear cuenta](https://supabase.com))
  - **Opción 2**: PostgreSQL instalado localmente

### Setup Rápido (Recomendado) ⚡

1. **Fork el repositorio**
   - Haz clic en "Fork" en la esquina superior derecha de GitHub

2. **Clonar tu fork**
```bash
git clone https://github.com/TU-USUARIO/ranked-vote.git
cd ranked-vote
```

3. **Agregar upstream remote**
```bash
git remote add upstream https://github.com/jblancoh/ranked-vote.git
```

4. **Ejecutar script de instalación automática**
```bash
./scripts/setup.sh
```

Este script hará **TODO** por ti:
- ✅ Verificará que tienes Node.js instalado
- ✅ Instalará dependencias del frontend y backend
- ✅ Te guiará para configurar la base de datos (Supabase o local)
- ✅ Creará archivos de configuración (.env)
- ✅ Ejecutará migraciones y seed de datos

5. **Iniciar el proyecto en desarrollo**
```bash
./scripts/start-dev.sh
```

Este script:
- ✅ Inicia el backend en `http://localhost:5001`
- ✅ Inicia el frontend en `http://localhost:5173`
- ✅ Muestra mensajes claros de estado
- ✅ Presiona `Ctrl+C` para detener ambos servicios

### Setup Manual (Alternativo)

Si prefieres configurar manualmente o el script automático falla:

<details>
<summary>Ver pasos manuales</summary>

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edita frontend/.env si es necesario
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edita backend/.env con tu DATABASE_URL
```

**Base de datos:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate dev
npm run prisma:seed
```

**Ejecutar en desarrollo:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

</details>

### Verificar que Todo Funciona ✅

1. Abre `http://localhost:5173` en tu navegador
2. Deberías ver la lista de candidatos
3. El backend API está en `http://localhost:5001`
4. Para ver la base de datos visualmente: `cd backend && npx prisma studio`

---

## 🔄 Proceso de Contribución

### 1. Encuentra o Crea un Issue

**Para Hacktoberfest 2025:**
- 🎃 Ver [Issues de Hacktoberfest](https://github.com/jblancoh/ranked-vote/issues?q=is%3Aissue+is%3Aopen+label%3Ahacktoberfest)
- 📋 Consulta la [Guía Completa de Issues](../docs/HACKTOBERFEST_ISSUES_2025.md)

**Para contribuciones generales:**
- Busca en [Issues existentes](https://github.com/jblancoh/ranked-vote/issues)
- Para bugs: usa la plantilla de bug report
- Para features: usa la plantilla de feature request

**Etiquetas por Nivel:**
- 🟢 `good-first-issue` - **Principiantes** (1-2 horas, perfecto para empezar)
- 🟡 `hacktoberfest` - **Intermedios** (2-4 horas, conoces React/Node)
- 🔴 `help-wanted` - **Avanzados** (6-8 horas, arquitectura/testing)

**Etiquetas por Tipo:**
- `backend` - Node.js, Express, Prisma
- `frontend` - React, Tailwind, UI/UX
- `documentation` - Docs, guías, traducciones
- `testing` - Tests unitarios, E2E, calidad
- `priority-high` - Crítico para el evento

### 2. Comenta en el Issue

**Antes de empezar a trabajar**, comenta en el issue para:
- ✅ Evitar trabajo duplicado
- ✅ Recibir orientación del equipo
- ✅ Confirmar que el issue sigue disponible

**Ejemplos de buenos comentarios:**

```markdown
¡Hola! Me gustaría trabajar en este issue.
Soy [principiante/intermedio/avanzado] en [tecnología].
¿Puedo tomarlo?
```

```markdown
Tengo una idea para resolver esto usando [enfoque].
¿Les parece bien antes de empezar?
```

**Para Hacktoberfest:**
- Si eres **principiante**, elige issues `good-first-issue`
- Si trabajas en **equipo**, menciona a tus compañeros
- Respeta el tiempo de los demás: si tomas un issue, trabaja en él activamente

### 3. Crea una Branch

```bash
# Actualiza main
git checkout main
git pull upstream main

# Crea tu feature branch
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/nombre-del-bug
```

Convención de nombres de branches:
- `feature/` - Para nuevas features
- `fix/` - Para bug fixes
- `docs/` - Para documentación
- `refactor/` - Para refactorización
- `test/` - Para tests

### 4. Haz tus Cambios

- Escribe código limpio y legible
- Sigue las guías de estilo del proyecto
- Agrega comentarios cuando sea necesario
- Haz commits frecuentes y descriptivos

### 5. Prueba tus Cambios

```bash
# Frontend
npm run lint
npm run format:check

# Backend
npm run lint
# Si hay tests:
npm test
```

### 6. Commit tus Cambios

```bash
git add .
git commit -m "Add: descripción clara del cambio"
```

Ver [Convenciones de Commits](#convenciones-de-commits) para más detalles.

### 7. Push a tu Fork

```bash
git push origin feature/nombre-descriptivo
```

### 8. Crea un Pull Request

1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Llena la plantilla de PR
4. Asegúrate de marcar todos los items del checklist
5. Asigna reviewers si conoces a alguien del equipo

---

## 📏 Guías de Estilo

### JavaScript/React

```javascript
// ✅ Bueno
const handleVoteSubmit = async (voteData) => {
  try {
    const response = await api.submitVote(voteData)
    console.log('Voto enviado exitosamente')
    return response.data
  } catch (error) {
    console.error('Error al enviar voto:', error)
    throw error
  }
}

// ❌ Malo
const handleVoteSubmit = async (d) => {
  const r = await api.submitVote(d)
  return r.data
}
```

**Reglas:**
- Usa `const` y `let`, nunca `var`
- Nombres descriptivos para variables y funciones
- CamelCase para variables y funciones
- PascalCase para componentes React
- Comentarios en español
- Arrow functions cuando sea posible
- Destructuring cuando sea apropiado

### CSS/Tailwind

```jsx
// ✅ Bueno - Usa clases de Tailwind
<button className="btn-primary px-4 py-2 rounded-lg hover:bg-primary-700">
  Votar
</button>

// ❌ Malo - Inline styles innecesarios
<button style={{padding: '8px 16px', backgroundColor: 'blue'}}>
  Votar
</button>
```

### Estructura de Componentes React

```jsx
// Orden recomendado:
// 1. Imports
import { useState } from 'react'
import { api } from '@/services/api'

// 2. Componente
const MiComponente = ({ prop1, prop2 }) => {
  // 3. State
  const [data, setData] = useState(null)
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  }
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 7. Export
export default MiComponente
```

### Backend/API

```javascript
// ✅ Bueno
export const getVotesByEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params
    
    const votes = await prisma.vote.findMany({
      where: { eventId },
      include: {
        firstPlace: true,
        secondPlace: true,
      }
    })
    
    res.json({
      success: true,
      data: votes
    })
  } catch (error) {
    next(error)
  }
}

// ❌ Malo
export const getVotesByEvent = (req, res) => {
  prisma.vote.findMany({
    where: { eventId: req.params.eventId }
  }).then(v => res.json(v))
}
```

---

## 📝 Convenciones de Commits

Usamos convenciones de commit descriptivas:

### Formato

```
<tipo>: <descripción corta>

<descripción larga opcional>

<footer opcional>
```

### Tipos de Commit

- `Add:` - Agregar nueva feature o archivo
- `Fix:` - Corregir un bug
- `Update:` - Actualizar feature existente
- `Remove:` - Eliminar código o archivo
- `Refactor:` - Refactorizar código
- `Docs:` - Solo cambios en documentación
- `Style:` - Cambios de formato (no afectan el código)
- `Test:` - Agregar o actualizar tests
- `Chore:` - Cambios en build, configuración, etc.

### Ejemplos

```bash
# Feature nueva
git commit -m "Add: formulario de votación con validación"

# Bug fix
git commit -m "Fix: error al enviar votos duplicados"

# Documentación
git commit -m "Docs: agregar guía de instalación en README"

# Refactorización
git commit -m "Refactor: optimizar queries de resultados"

# Con descripción larga
git commit -m "Add: dashboard de resultados en tiempo real

- Implementar gráficas con Recharts
- Agregar filtros por municipio
- Optimizar queries para mejor performance"
```

---

## ✅ Pull Request Checklist

Antes de crear tu PR, verifica:

- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación relevante
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado mis cambios localmente
- [ ] Los linters pasan sin errores (`npm run lint`)
- [ ] El código está formateado (`npm run format`)
- [ ] He agregado tests si es necesario
- [ ] Todos los tests pasan
- [ ] Mi branch está actualizado con main
- [ ] El commit message sigue las convenciones
- [ ] He referenciado el issue relacionado (#123)

---

## 🎯 Tips para PRs Exitosos

### DO ✅

- **Haz PRs pequeños y enfocados** - Un PR = Una feature/fix
- **Escribe descripciones claras** - Explica QUÉ y POR QUÉ
- **Agrega screenshots** - Si cambias UI, muestra antes/después
- **Responde a reviews** - Los reviewers están ayudándote
- **Sé paciente** - Los reviews pueden tomar tiempo
- **Prueba bien** - Tu código debe funcionar

### DON'T ❌

- **No hagas PRs gigantes** - Difíciles de revisar
- **No ignores los linters** - Arregla los warnings
- **No trabajes en main** - Usa branches
- **No copies código sin entender** - Aprende primero
- **No te ofendas por feedback** - Es para mejorar
- **No hagas fuerza push** - A menos que sea necesario

---

## 🆘 ¿Necesitas Ayuda?

### Documentación del Proyecto

- 📖 [Guía de Inicio Rápido](../INICIO_RAPIDO.md) - Para empezar rápido
- 📋 [Setup Multi-Tenant](../docs/SETUP_MULTITENANT.md) - Guía técnica completa
- 🎃 [Issues de Hacktoberfest](../docs/HACKTOBERFEST_ISSUES_2025.md) - Todos los issues explicados
- 📚 [Referencia API](../docs/API_REFERENCE.md) - Documentación de endpoints (próximamente)

### Dónde Preguntar

- **Issues de GitHub** - Para bugs y features específicas
- **Discussions** - Para preguntas generales sobre el proyecto
- **Dev Night Talk** - Comunidad de Villahermosa (todos los jueves 7-10 PM)
- **Email** - jblancoh26@gmail.com

### Recursos Útiles

**Tecnologías del Proyecto:**
- [React 18](https://react.dev) - Framework frontend
- [Vite](https://vitejs.dev) - Build tool
- [Prisma](https://www.prisma.io/docs) - ORM para base de datos
- [Tailwind CSS](https://tailwindcss.com/docs) - Estilos
- [Express](https://expressjs.com/) - Backend framework
- [Zod](https://zod.dev) - Validación de schemas

**Git y Open Source:**
- [Guía de Git](https://www.atlassian.com/git) - Conceptos básicos
- [Primeros Pasos en Open Source](https://opensource.guide/how-to-contribute/) - Para principiantes
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) - Workflow colaborativo
- [Conventional Commits](https://www.conventionalcommits.org/) - Formato de commits

---

## 🎉 ¡Gracias por Contribuir!

Tu tiempo y esfuerzo son muy apreciados. Juntos estamos construyendo algo especial para la comunidad de Tabasco y más allá.

### Reconocimientos

Todos los contribuyentes serán:
- ✅ Agregados a la sección de contributors en el README
- ✅ Mencionados en los release notes
- ✅ Invitados a presentar su contribución en Dev Night Talk Villahermosa

### Hacktoberfest 2025

Si participas en Hacktoberfest:
- 🎃 Completa 4 PRs válidos durante octubre
- ✅ Asegúrate de que tus PRs sean aceptados
- 🎁 Recibirás reconocimiento digital de Hacktoberfest

**¡Feliz Hacktoberfest! 🎃**

---

## 📞 Contacto

- **Proyecto:** https://github.com/jblancoh/ranked-vote
- **Issues:** https://github.com/jblancoh/ranked-vote/issues
- **Hacktoberfest Issues:** [Ver aquí](https://github.com/jblancoh/ranked-vote/issues?q=is%3Aissue+is%3Aopen+label%3Ahacktoberfest)
- **Comunidad:** Dev Night Talk Villahermosa (Todos los jueves 7-10 PM)
- **Email:** jblancoh26@gmail.com

---

## 🗺️ Roadmap del Proyecto

**Prioridades Actuales (Octubre 2025):**

1. **Sistema de Verificación por Email** (#43, #46) - CRÍTICO
2. **Panel de Administración** (#26-#35) - ALTA
3. **Exportación de Resultados** (#32) - MEDIA
4. **Suite de Tests** (#18, #49) - MEDIA
5. **Documentación Completa** (#40, #41) - MEDIA

**Próximas Features:**
- Multi-idioma completo
- App móvil (React Native)
- Analytics avanzados
- Compartir en redes sociales

---

*Última actualización: Octubre 2025*
*Versión: 1.0.0-beta*