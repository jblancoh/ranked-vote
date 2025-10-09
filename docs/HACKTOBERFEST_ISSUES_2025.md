# 🎃 Hacktoberfest 2025 - Issues de Vota Flor

> **Taller**: 4 horas presenciales
> **Deadline PR**: 31 de octubre 2025
> **Participantes esperados**: ~20 personas
> **Distribución**: 40% principiantes | 40% intermedios | 20% avanzados

---

## 📋 Tabla de Contenidos

- [🟢 Nivel Principiante](#-nivel-principiante-good first issue) (8 issues)
- [🟡 Nivel Intermedio](#-nivel-intermedio-hacktoberfest) (8 issues)
- [🔴 Nivel Avanzado](#-nivel-avanzado-help-wanted) (4 issues)
- [📝 Plantilla para Issues](#-plantilla-para-crear-issues)

---

## 🟢 Nivel Principiante (good first issue)

### **Backend - Prioridad 1**

#### Issue #1: Agregar validación de datos en endpoint de votos
**Labels**: `good first issue`, `backend`, `validation`, `hacktoberfest`
**Tiempo estimado**: 1-2 horas
**Prioridad**: Alta (Backend = 1)

**Descripción:**
El endpoint `POST /api/votes` actualmente acepta datos sin validaciones robustas. Necesitamos agregar validaciones usando Zod para asegurar la integridad de los datos.

**Tareas:**
- [ ] Crear schema de validación en `backend/src/validators/vote.validator.js`
- [ ] Validar que `firstPlace` a `fifthPlace` sean IDs válidos de candidatos
- [ ] Validar que no se repitan candidatos en las posiciones
- [ ] Validar que todos los campos requeridos estén presentes
- [ ] Agregar mensajes de error descriptivos en español

**Archivos a modificar:**
- `backend/src/controllers/votes.controller.js`
- Crear: `backend/src/validators/vote.validator.js`

**Criterios de aceptación:**
- ✅ Schema de Zod creado con todas las validaciones
- ✅ Errores retornan status 400 con mensajes claros
- ✅ No se permite votar con candidatos duplicados
- ✅ Validación funciona correctamente con datos válidos e inválidos

**Recursos:**
- Documentación Zod: https://zod.dev
- Ejemplo en el proyecto: `backend/src/controllers/` (otros validadores)

---

#### Issue #2: Mejorar mensajes de error del middleware de tenant
**Labels**: `good first issue`, `backend`, `error-handling`, `hacktoberfest`
**Tiempo estimado**: 1 hora
**Prioridad**: Alta (Backend = 1)

**Descripción:**
Los mensajes de error del middleware de tenant son técnicos y en inglés. Necesitamos hacerlos más amigables y en español para los usuarios finales.

**Tareas:**
- [ ] Revisar `backend/src/middleware/tenant.middleware.js`
- [ ] Cambiar mensajes de error a español
- [ ] Hacer mensajes más descriptivos y user-friendly
- [ ] Agregar códigos de error únicos (ej: `TENANT_NOT_FOUND`, `TENANT_INACTIVE`)
- [ ] Documentar los códigos de error en un comentario

**Archivos a modificar:**
- `backend/src/middleware/tenant.middleware.js`

**Criterios de aceptación:**
- ✅ Todos los mensajes están en español
- ✅ Mensajes son descriptivos y ayudan al usuario a resolver el problema
- ✅ Cada error tiene un código único
- ✅ Documentación de códigos en el archivo

---

### **Frontend - Prioridad 2**

#### Issue #3: Agregar indicador de carga en botón de votación
**Labels**: `good first issue`, `frontend`, `ux`, `hacktoberfest`
**Tiempo estimado**: 1-2 horas
**Prioridad**: Media (Frontend = 2)

**Descripción:**
Cuando el usuario envía su voto, no hay feedback visual durante el proceso de envío. Esto puede causar confusión y múltiples clics.

**Tareas:**
- [ ] Agregar estado de `isSubmitting` en `frontend/src/pages/Vote.jsx`
- [ ] Deshabilitar botón durante el envío
- [ ] Mostrar spinner o texto "Enviando..." en el botón
- [ ] Asegurar que no se puedan enviar múltiples votos

**Archivos a modificar:**
- `frontend/src/pages/Vote.jsx`
- (Opcional) `frontend/src/components/ui/Button.jsx`

**Criterios de aceptación:**
- ✅ Botón se deshabilita al hacer clic
- ✅ Muestra indicador visual de carga
- ✅ No se pueden enviar múltiples votos
- ✅ Botón se habilita de nuevo si hay error

---

#### Issue #4: Mejorar diseño responsive de tarjetas de candidatos
**Labels**: `good first issue`, `frontend`, `css`, `responsive`, `hacktoberfest`
**Tiempo estimado**: 1-2 horas
**Prioridad**: Media (Frontend = 2)

**Descripción:**
Las tarjetas de candidatos se ven bien en desktop pero necesitan mejoras en móviles y tablets.

**Tareas:**
- [ ] Revisar el componente de tarjetas de candidatos
- [ ] Ajustar padding y spacing para móviles
- [ ] Asegurar que las imágenes mantengan aspect ratio
- [ ] Mejorar layout en tablets (2 columnas)
- [ ] Probar en diferentes tamaños de pantalla

**Archivos a modificar:**
- `frontend/src/pages/Vote.jsx`
- `frontend/src/components/ui/Card.jsx`

**Criterios de aceptación:**
- ✅ Tarjetas se ven bien en móviles (320px+)
- ✅ Layout de 2 columnas en tablets
- ✅ Imágenes no se deforman
- ✅ Texto legible en todos los tamaños

---

### **Documentación - Prioridad 3**

#### Issue #5: Crear guía de contribución para principiantes
**Labels**: `good first issue`, `documentation`, `hacktoberfest`
**Tiempo estimado**: 2 horas
**Prioridad**: Media (Documentación = 3)

**Descripción:**
Necesitamos una guía clara para que nuevos contribuyentes sepan cómo empezar a contribuir al proyecto.

**Tareas:**
- [ ] Crear documento `docs/CONTRIBUIR_PRINCIPIANTES.md`
- [ ] Explicar cómo hacer fork y clone
- [ ] Explicar estructura básica del proyecto
- [ ] Guía de cómo crear una rama y hacer PR
- [ ] Incluir ejemplos de buenos commits
- [ ] Agregar sección de troubleshooting común

**Archivos a crear:**
- `docs/CONTRIBUIR_PRINCIPIANTES.md`

**Criterios de aceptación:**
- ✅ Guía completa con todos los pasos
- ✅ Lenguaje claro y amigable
- ✅ Incluye capturas de pantalla o diagramas
- ✅ Ejemplos concretos y prácticos

---

#### Issue #6: Documentar API endpoints con ejemplos
**Labels**: `good first issue`, `documentation`, `api`, `hacktoberfest`
**Tiempo estimado**: 2 horas
**Prioridad**: Media (Documentación = 3)

**Descripción:**
Los endpoints de la API necesitan documentación clara con ejemplos de requests y responses.

**Tareas:**
- [ ] Crear documento `docs/API_REFERENCE.md`
- [ ] Documentar todos los endpoints (GET, POST, etc.)
- [ ] Incluir ejemplos de request body con curl
- [ ] Incluir ejemplos de responses exitosas y errores
- [ ] Documentar parámetros y headers requeridos
- [ ] Agregar códigos de status HTTP

**Archivos a crear:**
- `docs/API_REFERENCE.md`

**Criterios de aceptación:**
- ✅ Todos los endpoints documentados
- ✅ Ejemplos de curl funcionando
- ✅ Responses de ejemplo claras
- ✅ Documentación de errores incluida

---

#### Issue #7: Traducir README al inglés
**Labels**: `good first issue`, `documentation`, `i18n`, `hacktoberfest`
**Tiempo estimado**: 1-2 horas
**Prioridad**: Baja (Documentación = 3)

**Descripción:**
El README actual está en español. Necesitamos una versión en inglés para atraer colaboradores internacionales.

**Tareas:**
- [ ] Crear `README.en.md`
- [ ] Traducir todo el contenido al inglés
- [ ] Mantener el formato y estructura
- [ ] Agregar badge de idioma en README principal
- [ ] Actualizar enlaces si es necesario

**Archivos a crear:**
- `README.en.md`

**Archivos a modificar:**
- `README.md` (agregar link al inglés)

**Criterios de aceptación:**
- ✅ Traducción completa y precisa
- ✅ Formato consistente con el original
- ✅ Links funcionando correctamente
- ✅ Badge de idioma visible

---

#### Issue #8: Agregar comentarios JSDoc a funciones principales
**Labels**: `good first issue`, `documentation`, `code-quality`, `hacktoberfest`
**Tiempo estimado**: 2 horas
**Prioridad**: Media (Documentación = 3)

**Descripción:**
Las funciones principales del backend necesitan comentarios JSDoc para facilitar el mantenimiento y onboarding.

**Tareas:**
- [ ] Agregar JSDoc a controllers en `backend/src/controllers/`
- [ ] Documentar parámetros, tipos de retorno y excepciones
- [ ] Incluir ejemplos de uso cuando sea relevante
- [ ] Asegurar formato correcto de JSDoc

**Archivos a modificar:**
- `backend/src/controllers/votes.controller.js`
- `backend/src/controllers/candidates.controller.js`
- `backend/src/controllers/results.controller.js`

**Criterios de aceptación:**
- ✅ Todas las funciones exportadas tienen JSDoc
- ✅ Parámetros y tipos documentados
- ✅ Formato JSDoc correcto
- ✅ Ejemplos cuando sea relevante

---

## 🟡 Nivel Intermedio (hacktoberfest)

### **Backend - Prioridad 1**

#### Issue #9: Implementar validación de email para votos
**Labels**: `hacktoberfest`, `backend`, `feature`, `priority-high`
**Tiempo estimado**: 3-4 horas
**Prioridad**: Crítica (Validación Email = 1)

**Descripción:**
Actualmente los votos solo se validan por IP. Necesitamos agregar opción de validación por email con código de verificación.

**Tareas:**
- [ ] Crear modelo o tabla temporal para códigos de verificación
- [ ] Endpoint POST `/api/votes/request-code` que envíe código por email
- [ ] Endpoint POST `/api/votes/verify` que valide el código
- [ ] Integrar con servicio de email (NodeMailer o similar)
- [ ] Agregar timeout de 10 minutos para códigos
- [ ] Actualizar lógica de votación para soportar validación por email

**Archivos a crear:**
- `backend/src/services/email.service.js`
- `backend/src/validators/email.validator.js`

**Archivos a modificar:**
- `backend/src/controllers/votes.controller.js`
- `backend/src/routes/votes.routes.js`
- `backend/prisma/schema.prisma` (nueva tabla VerificationCode)

**Criterios de aceptación:**
- ✅ Email se envía correctamente con código
- ✅ Código expira después de 10 minutos
- ✅ No se puede votar sin verificar email
- ✅ Validación funciona end-to-end
- ✅ Documentación de nuevos endpoints

**Recursos:**
- NodeMailer: https://nodemailer.com/
- Ejemplo de códigos de verificación

---

#### Issue #10: Crear endpoint para estadísticas del evento
**Labels**: `hacktoberfest`, `backend`, `api`, `analytics`
**Tiempo estimado**: 3 horas
**Prioridad**: Media (Backend = 1)

**Descripción:**
Crear endpoint que retorne estadísticas generales del evento: total de votos, participación por hora, candidatos más votados, etc.

**Tareas:**
- [ ] Crear endpoint GET `/api/events/:eventId/stats`
- [ ] Calcular total de votos
- [ ] Calcular participación por hora del día
- [ ] Obtener top 5 candidatos
- [ ] Agregar tasa de participación
- [ ] Cachear resultados (opcional pero recomendado)

**Archivos a crear:**
- `backend/src/controllers/stats.controller.js`
- `backend/src/routes/stats.routes.js`

**Criterios de aceptación:**
- ✅ Endpoint retorna todas las estadísticas
- ✅ Formato JSON claro y estructurado
- ✅ Performance óptima (< 500ms)
- ✅ Documentado en API_REFERENCE.md

---

#### Issue #11: Agregar paginación a endpoint de candidatos
**Labels**: `hacktoberfest`, `backend`, `api`, `optimization`
**Tiempo estimado**: 2-3 horas
**Prioridad**: Media (Backend = 1)

**Descripción:**
El endpoint de candidatos retorna todos los resultados. Para eventos con muchos candidatos, necesitamos paginación.

**Tareas:**
- [ ] Agregar query params `page` y `limit` a GET `/api/candidates`
- [ ] Implementar paginación con Prisma
- [ ] Retornar metadata (totalCount, currentPage, totalPages)
- [ ] Validar parámetros de paginación
- [ ] Mantener compatibilidad con frontend actual

**Archivos a modificar:**
- `backend/src/controllers/candidates.controller.js`

**Criterios de aceptación:**
- ✅ Paginación funciona correctamente
- ✅ Metadata incluida en response
- ✅ Validación de parámetros
- ✅ Backward compatible (sin params retorna todos)

---

### **Frontend - Prioridad 2**

#### Issue #12: Crear componente de verificación por email
**Labels**: `hacktoberfest`, `frontend`, `component`, `priority-high`
**Tiempo estimado**: 3-4 horas
**Prioridad**: Crítica (relacionado con Issue #9)

**Descripción:**
Frontend para el flujo de verificación de email antes de votar.

**Tareas:**
- [ ] Crear componente `EmailVerification.jsx`
- [ ] Form para ingresar email
- [ ] Input para código de verificación
- [ ] Integración con endpoints de verificación
- [ ] Manejo de estados (enviando, verificando, error)
- [ ] Timer de expiración visible (10 min countdown)

**Archivos a crear:**
- `frontend/src/components/EmailVerification.jsx`
- `frontend/src/services/verification.js`

**Archivos a modificar:**
- `frontend/src/pages/Vote.jsx`

**Criterios de aceptación:**
- ✅ Flujo completo de verificación funciona
- ✅ Mensajes de error claros
- ✅ UI intuitiva y responsive
- ✅ Timer countdown visible

---

#### Issue #13: Implementar modo oscuro (dark mode)
**Labels**: `hacktoberfest`, `frontend`, `ux`, `accessibility`
**Tiempo estimado**: 3-4 horas
**Prioridad**: Media (Frontend = 2)

**Descripción:**
Agregar soporte para modo oscuro con toggle persistente en localStorage.

**Tareas:**
- [ ] Crear hook `useTheme` para manejar tema
- [ ] Agregar clases de Tailwind para dark mode
- [ ] Crear toggle switch en Header
- [ ] Persistir preferencia en localStorage
- [ ] Actualizar todos los componentes principales
- [ ] Respetar preferencia del sistema

**Archivos a crear:**
- `frontend/src/hooks/useTheme.js`

**Archivos a modificar:**
- `frontend/src/components/layout/Header.jsx`
- `frontend/src/pages/*.jsx` (actualizar estilos)
- `frontend/tailwind.config.js`

**Criterios de aceptación:**
- ✅ Toggle funciona correctamente
- ✅ Tema persiste después de reload
- ✅ Todos los componentes se ven bien en dark mode
- ✅ Respeta preferencia del sistema operativo

---

#### Issue #14: Crear página de "Acerca de" con información del evento
**Labels**: `hacktoberfest`, `frontend`, `content`
**Tiempo estimado**: 2-3 horas
**Prioridad**: Baja (Frontend = 2)

**Descripción:**
Página informativa sobre el evento, el proyecto y cómo contribuir.

**Tareas:**
- [ ] Crear layout para página About
- [ ] Agregar información del evento Flor de Tabasco
- [ ] Sección de créditos y colaboradores
- [ ] Links a redes sociales y GitHub
- [ ] Agregar ruta en React Router

**Archivos a modificar:**
- `frontend/src/pages/About.jsx` (expandir contenido)
- `frontend/src/App.jsx` (si no existe la ruta)

**Criterios de aceptación:**
- ✅ Contenido completo e informativo
- ✅ Diseño atractivo y responsive
- ✅ Links funcionando correctamente
- ✅ Integrado en navegación

---

#### Issue #15: Agregar notificaciones toast para acciones del usuario
**Labels**: `hacktoberfest`, `frontend`, `ux`, `library`
**Tiempo estimado**: 3 horas
**Prioridad**: Media (Frontend = 2)

**Descripción:**
Implementar sistema de notificaciones toast para feedback de acciones (voto exitoso, errores, etc.)

**Tareas:**
- [ ] Instalar librería de toast (react-hot-toast o similar)
- [ ] Crear hook `useToast` customizado
- [ ] Integrar en acciones principales (votar, etc.)
- [ ] Diseñar estilos consistentes con el tema
- [ ] Agregar toasts de éxito, error, warning

**Archivos a crear:**
- `frontend/src/hooks/useToast.js`
- `frontend/src/components/ui/Toast.jsx` (si custom)

**Archivos a modificar:**
- `frontend/src/pages/Vote.jsx`
- `frontend/package.json`

**Criterios de aceptación:**
- ✅ Toasts se muestran correctamente
- ✅ Estilos consistentes con la app
- ✅ Auto-dismiss configurado
- ✅ Accesible (ARIA labels)

---

#### Issue #16: Implementar búsqueda/filtro de candidatos
**Labels**: `hacktoberfest`, `frontend`, `feature`, `ux`
**Tiempo estimado**: 3 horas
**Prioridad**: Media (Frontend = 2)

**Descripción:**
Agregar campo de búsqueda para filtrar candidatos por nombre o municipio.

**Tareas:**
- [ ] Crear input de búsqueda en página Vote
- [ ] Implementar lógica de filtrado client-side
- [ ] Agregar debounce para performance
- [ ] Mostrar mensaje cuando no hay resultados
- [ ] Mantener selección al filtrar

**Archivos a modificar:**
- `frontend/src/pages/Vote.jsx`
- `frontend/src/hooks/useCandidates.js`

**Criterios de aceptación:**
- ✅ Búsqueda funciona en tiempo real
- ✅ Filtra por nombre y municipio
- ✅ Performance óptima con debounce
- ✅ UX clara y responsive

---

## 🔴 Nivel Avanzado (help-wanted)

### **Backend - Prioridad 2**

#### Issue #17: Crear panel de administración (backend)
**Labels**: `help-wanted`, `backend`, `feature`, `priority-high`, `complex`
**Tiempo estimado**: 6-8 horas
**Prioridad**: Alta (Admin Panel = 2)

**Descripción:**
Implementar sistema completo de autenticación y autorización para administradores del tenant.

**Tareas:**
- [ ] Implementar JWT authentication
- [ ] Endpoints de auth (login, logout, refresh token)
- [ ] Middleware de autorización por roles
- [ ] Endpoints CRUD para gestionar candidatos
- [ ] Endpoints para gestionar configuración del tenant
- [ ] Endpoint para ver analytics avanzados
- [ ] Hash de contraseñas con bcrypt
- [ ] Protección contra brute force

**Archivos a crear:**
- `backend/src/controllers/auth.controller.js`
- `backend/src/controllers/admin.controller.js`
- `backend/src/middleware/auth.middleware.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/routes/admin.routes.js`
- `backend/src/services/jwt.service.js`

**Archivos a modificar:**
- `backend/src/app.js`
- `backend/package.json` (agregar bcrypt, jsonwebtoken)

**Criterios de aceptación:**
- ✅ Sistema de auth completo y seguro
- ✅ Roles implementados (admin, moderator)
- ✅ Tokens con refresh funcionando
- ✅ Endpoints admin protegidos
- ✅ Tests de seguridad pasando
- ✅ Documentación de endpoints

**Recursos:**
- JWT Best Practices
- bcrypt documentation

---

#### Issue #18: Implementar exportación de resultados a CSV/PDF
**Labels**: `help-wanted`, `backend`, `feature`, `export`
**Tiempo estimado**: 5-6 horas
**Prioridad**: Media (Exportación = 3)

**Descripción:**
Crear endpoints para exportar resultados de votación en formatos CSV y PDF.

**Tareas:**
- [ ] Endpoint GET `/api/results/export/csv`
- [ ] Endpoint GET `/api/results/export/pdf`
- [ ] Integrar librería de PDF (pdfkit o puppeteer)
- [ ] Formatear datos para exportación
- [ ] Agregar headers apropiados para descarga
- [ ] Incluir metadata del evento
- [ ] Diseño de PDF profesional

**Archivos a crear:**
- `backend/src/services/export.service.js`
- `backend/src/utils/pdf.generator.js`

**Archivos a modificar:**
- `backend/src/controllers/results.controller.js`
- `backend/src/routes/results.routes.js`
- `backend/package.json`

**Criterios de aceptación:**
- ✅ CSV se genera correctamente
- ✅ PDF tiene diseño profesional
- ✅ Ambos formatos incluyen todos los datos
- ✅ Performance aceptable (< 5 segundos)
- ✅ Documentación de endpoints

---

### **Testing - Prioridad 5**

#### Issue #19: Implementar suite de tests para backend
**Labels**: `help-wanted`, `testing`, `backend`, `quality`
**Tiempo estimado**: 6-8 horas
**Prioridad**: Media (Testing = 5)

**Descripción:**
Crear suite completa de tests unitarios y de integración para el backend usando Jest y Supertest.

**Tareas:**
- [ ] Configurar Jest y Supertest
- [ ] Tests unitarios para controllers
- [ ] Tests de integración para endpoints principales
- [ ] Tests de validaciones
- [ ] Tests de middleware (tenant, auth)
- [ ] Mock de Prisma
- [ ] Configurar coverage reports
- [ ] Script de CI para tests

**Archivos a crear:**
- `backend/jest.config.js`
- `backend/src/__tests__/` (todo el directorio)
- `backend/src/__mocks__/prisma.js`

**Archivos a modificar:**
- `backend/package.json`

**Criterios de aceptación:**
- ✅ Coverage > 70%
- ✅ Todos los tests pasan
- ✅ Tests de endpoints principales
- ✅ Mocks configurados correctamente
- ✅ Documentación de cómo correr tests

**Recursos:**
- Jest documentation
- Supertest examples

---

#### Issue #20: Implementar tests E2E con Playwright
**Labels**: `help-wanted`, `testing`, `frontend`, `e2e`, `quality`
**Tiempo estimado**: 6-8 horas
**Prioridad**: Media (Testing = 5)

**Descripción:**
Crear suite de tests end-to-end para flujos críticos usando Playwright.

**Tareas:**
- [ ] Configurar Playwright
- [ ] Test E2E: flujo completo de votación
- [ ] Test E2E: verificación de email
- [ ] Test E2E: visualización de resultados
- [ ] Tests de responsive (móvil, tablet, desktop)
- [ ] Tests de accesibilidad básicos
- [ ] Screenshots de comparación visual
- [ ] CI pipeline para E2E tests

**Archivos a crear:**
- `e2e/` (todo el directorio)
- `playwright.config.js`

**Archivos a modificar:**
- `package.json` (root)

**Criterios de aceptación:**
- ✅ Flujos principales cubiertos
- ✅ Tests pasan en múltiples navegadores
- ✅ Tests responsive incluidos
- ✅ CI configurado
- ✅ Documentación de tests

**Recursos:**
- Playwright documentation
- Best practices E2E testing

---

## 📝 Plantilla para Crear Issues

Usa esta plantilla al crear los issues en GitHub:

```markdown
## 📋 Descripción
[Descripción clara del problema o feature]

## 🎯 Objetivo
[Qué se espera lograr con este issue]

## ✅ Tareas
- [ ] Tarea 1
- [ ] Tarea 2
- [ ] Tarea 3

## 📁 Archivos Involucrados
**Crear:**
- `path/to/new/file.js`

**Modificar:**
- `path/to/existing/file.js`

## ✨ Criterios de Aceptación
- ✅ Criterio 1
- ✅ Criterio 2

## 📚 Recursos
- [Link a documentación]
- [Link a ejemplo]

## 🏷️ Labels
- `good first issue` / `hacktoberfest` / `help-wanted`
- `backend` / `frontend` / `documentation` / `testing`
- `priority-high` / `priority-medium` / `priority-low`

## ⏱️ Tiempo Estimado
X-Y horas

## 💡 Notas Adicionales
[Cualquier información extra relevante]
```

---

## 🎓 Guía de Selección de Issues para Participantes

### Para Principiantes (Primera vez con open source):
- Issues #1-#8
- Enfócate en: #3, #4, #7, #8 (más visuales y menos técnicos)

### Para Intermedios (Conocen React/Node):
- Issues #9-#16
- Recomendados: #9, #12 (críticos y retadores)

### Para Avanzados (Experiencia con arquitectura):
- Issues #17-#20
- Pueden mentorear a otros mientras trabajan en su issue

---

## 🤝 Trabajo en Equipo Sugerido

**Equipos de 2 personas:**
- Issue #9 + #12 (Email verification backend + frontend)
- Issue #17 (Admin panel - backend complejo)
- Issue #19 + #20 (Testing backend + E2E)

**Issues individuales:**
- #1-#8 (Principiantes)
- #10, #11, #13, #14, #15, #16 (Intermedios)
- #18 (Avanzado individual)

---

## 📊 Métricas de Éxito

**Para el taller:**
- ✅ 15+ PRs abiertos durante/después del taller
- ✅ 10+ PRs merged antes del 31 de octubre
- ✅ 80%+ de participantes completa al menos 1 issue

**Para el proyecto:**
- ✅ Email verification implementado (crítico)
- ✅ Admin panel funcional (crítico)
- ✅ Tests coverage > 50%
- ✅ Documentación mejorada

---

## 🎉 Reconocimientos

Todos los contribuyentes serán:
- ✅ Agregados a la sección de contributors en README
- ✅ Mencionados en el release notes de la versión 1.0
- ✅ Invitados a presentar su contribución en Dev Night Talk

---

**Última actualización**: 7 de octubre, 2025
**Mantenido por**: Dev Night Talk Villahermosa
