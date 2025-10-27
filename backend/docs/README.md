# 📚 Documentación JSDoc

Este directorio contiene la documentación generada automáticamente desde los comentarios JSDoc del código fuente.

## 🚀 Uso

### Ver la documentación

#### Opción 1: Abrir directamente
Abre el archivo `index.html` en tu navegador:
```bash
# Desde el directorio backend
open docs/jsdoc/index.html  # macOS
xdg-open docs/jsdoc/index.html  # Linux
start docs/jsdoc/index.html  # Windows
```

#### Opción 2: Servidor local (recomendado)
```bash
npm run docs:serve
```
Esto abrirá automáticamente la documentación en `http://localhost:8081`

### Regenerar la documentación

Después de hacer cambios en los comentarios JSDoc del código:
```bash
npm run docs:generate
```

## 📖 Navegación

La documentación incluye:
- **Global**: Todas las funciones, constantes y módulos del proyecto
- **Controllers**: Documentación de candidatos, votos, resultados, eventos
- **Middleware**: Manejo de errores, tenant
- **Config**: Configuración de tenant y Swagger

## 🎯 Beneficios

✅ **IntelliSense mejorado** - Autocompletado en VS Code
✅ **Documentación HTML** - Navega fácilmente por toda la API
✅ **Ejemplos de uso** - Cada función incluye ejemplos prácticos
✅ **Tipos documentados** - Parámetros y retornos claramente definidos

## 🔄 Actualización

Esta documentación debe regenerarse cada vez que se modifiquen los comentarios JSDoc:
```bash
npm run docs:generate
```

---

**Nota**: Este directorio está en `.gitignore` y debe regenerarse en cada entorno.
