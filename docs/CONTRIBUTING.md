# 🤝 Guía de Contribución - Vota Flor

¡Gracias por tu interés en contribuir a Vota Flor! Este proyecto celebra la cultura de Tabasco mientras ayudamos a digitalizar tradiciones locales. Cada contribución, grande o pequeña, hace la diferencia.

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

Este proyecto y todos los participantes están gobernados por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código. Por favor reporta comportamiento inaceptable a devnighttalk@gmail.com.

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

- Node.js 18+
- npm o yarn
- Git
- Cuenta de Supabase (para desarrollo con DB)

### Setup Paso a Paso

1. **Fork el repositorio**
   - Haz clic en "Fork" en la esquina superior derecha de GitHub

2. **Clonar tu fork**
```bash
git clone https://github.com/TU-USUARIO/vota-flor.git
cd vota-flor
```

3. **Agregar upstream remote**
```bash
git remote add upstream https://github.com/dev-night-talk/vota-flor.git
```

4. **Instalar dependencias**

Frontend:
```bash
cd frontend
npm install
cp .env.example .env
```

Backend:
```bash
cd backend
npm install
cp .env.example .env
```

5. **Configurar variables de entorno**

Edita los archivos `.env` con tus credenciales de Supabase.

6. **Ejecutar migraciones de base de datos**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

7. **Ejecutar en desarrollo**

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

---

## 🔄 Proceso de Contribución

### 1. Encuentra o Crea un Issue

- Busca en [Issues existentes](https://github.com/dev-night-talk/vota-flor/issues)
- Para bugs: usa la plantilla de bug report
- Para features: usa la plantilla de feature request
- Para dudas: crea un issue de tipo "Question"

Etiquetas útiles:
- `good-first-issue` - Perfecto para empezar
- `help-wanted` - Necesitamos ayuda
- `hacktoberfest` - Para Hacktoberfest
- `bug` - Algo no funciona
- `enhancement` - Nueva feature

### 2. Comenta en el Issue

Antes de empezar a trabajar, comenta en el issue para que otros sepan que lo estás tomando.

Ejemplo:
```
Hola! Me gustaría trabajar en esto. ¿Puedo tomarlo?
```

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

### Dónde Preguntar

- **Issues de GitHub** - Para bugs y features
- **Discussions** - Para preguntas generales
- **WhatsApp Dev Night Talk** - Para chat en tiempo real
- **Email** - devnighttalk@gmail.com

### Recursos Útiles

- [Documentación de React](https://react.dev)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Tailwind](https://tailwindcss.com/docs)
- [Guía de Git](https://www.atlassian.com/git)
- [Primeros Pasos en Open Source](https://opensource.guide/how-to-contribute/)

---

## 🎉 ¡Gracias por Contribuir!

Tu tiempo y esfuerzo son muy apreciados. Juntos estamos construyendo algo especial para la comunidad de Tabasco y más allá.

**¡Feliz Hacktoberfest! 🎃**

---

## 📞 Contacto

- **Proyecto:** https://github.com/dev-night-talk/vota-flor
- **Comunidad:** Dev Night Talk Villahermosa
- **Email:** devnighttalk@gmail.com
- **Twitter:** [@DevNightTalkVh](https://twitter.com/devnighttalkvh)

---

*Última actualización: Octubre 2025*