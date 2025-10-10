# 📚 Git Cheatsheet - Hacktoberfest 2025

> **Comandos esenciales para contribuir al proyecto Vota Flor**
> **Imprimir o proyectar durante el evento**

---

## 🚀 Setup Inicial (Una Sola Vez)

### Configurar Git
```bash
# Tu nombre (aparecerá en commits)
git config --global user.name "Tu Nombre"

# Tu email (debe coincidir con GitHub)
git config --global user.email "tu@email.com"

# Verificar configuración
git config --list
```

### Fork y Clone
```bash
# 1. Hacer fork en GitHub (botón en la interfaz)

# 2. Clonar TU fork
git clone https://github.com/TU-USUARIO/ranked-vote.git

# 3. Entrar al directorio
cd ranked-vote

# 4. Agregar el repositorio original como upstream
git remote add upstream https://github.com/jblancoh/ranked-vote.git

# 5. Verificar remotes
git remote -v
# Deberías ver:
# origin    https://github.com/TU-USUARIO/ranked-vote.git (tu fork)
# upstream  https://github.com/jblancoh/ranked-vote.git (original)
```

---

## 🌿 Trabajar con Branches

### Crear Nueva Branch
```bash
# Asegúrate de estar en main actualizado
git checkout main
git pull upstream main

# Crear y cambiar a nueva branch
git checkout -b fix/nombre-descriptivo

# Ejemplos de nombres:
# fix/responsive-cards
# feat/email-verification
# docs/api-reference
```

### Ver Branches
```bash
# Ver todas las branches locales
git branch

# Ver todas (locales y remotas)
git branch -a

# Ver branch actual
git branch --show-current
```

### Cambiar de Branch
```bash
# Cambiar a una branch existente
git checkout nombre-branch

# Volver a main
git checkout main
```

### Eliminar Branch
```bash
# Eliminar branch local (después de merge)
git branch -d nombre-branch

# Forzar eliminación
git branch -D nombre-branch
```

---

## 💾 Guardar Cambios (Commits)

### Ver Estado de Archivos
```bash
# Ver archivos modificados
git status

# Ver cambios específicos
git diff

# Ver cambios de un archivo específico
git diff ruta/al/archivo.js
```

### Agregar Archivos
```bash
# Agregar todos los archivos modificados
git add .

# Agregar archivo específico
git add ruta/al/archivo.js

# Agregar múltiples archivos
git add archivo1.js archivo2.css

# Agregar interactivamente (elegir qué cambios)
git add -p
```

### Crear Commit
```bash
# Commit con mensaje
git commit -m "fix: mejorar diseño responsive de tarjetas"

# Commit con mensaje multilinea
git commit -m "feat: agregar búsqueda de candidatos

- Agregar input de búsqueda
- Implementar filtrado por nombre
- Implementar filtrado por municipio"

# Modificar el último commit (antes de push)
git commit --amend -m "nuevo mensaje"
```

### Convención de Mensajes
```
Formato: tipo: descripción

Tipos comunes:
- feat:     nueva funcionalidad
- fix:      corrección de bug
- docs:     solo documentación
- style:    formato (no afecta lógica)
- refactor: mejora de código
- test:     agregar tests
- chore:    tareas de mantenimiento

Ejemplos:
✅ feat: agregar sistema de toast notifications
✅ fix: corregir error en validación de email
✅ docs: actualizar guía de contribución
✅ style: formatear código con prettier

❌ update files
❌ fix
❌ changes
```

---

## ☁️ Sincronizar con GitHub

### Push (Subir Cambios)
```bash
# Primera vez (nueva branch)
git push -u origin nombre-branch

# Siguientes veces
git push

# Forzar push (¡CUIDADO! solo si sabes lo que haces)
git push --force
```

### Pull (Bajar Cambios)
```bash
# Actualizar branch actual
git pull

# Actualizar main del repositorio original
git pull upstream main

# Bajar sin mergear automáticamente
git fetch origin
```

### Sincronizar tu Fork
```bash
# 1. Estar en main
git checkout main

# 2. Traer cambios del original
git fetch upstream

# 3. Mergear cambios
git merge upstream/main

# 4. Subir a tu fork
git push origin main
```

---

## 🔀 Merge y Rebase

### Mergear una Branch
```bash
# Estar en la branch destino (ej: main)
git checkout main

# Mergear otra branch
git merge nombre-branch
```

### Rebase (Mantener Historial Limpio)
```bash
# Actualizar tu branch con los últimos cambios de main
git checkout tu-branch
git rebase main

# Si hay conflictos, resolverlos y:
git add .
git rebase --continue

# Cancelar rebase
git rebase --abort
```

---

## 🆘 Deshacer Cambios

### Descartar Cambios NO Commiteados
```bash
# Descartar cambios en archivo específico
git checkout -- archivo.js

# Descartar TODOS los cambios
git reset --hard

# Quitar archivos del staging (antes de commit)
git reset archivo.js
```

### Deshacer Commits
```bash
# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (descartar cambios)
git reset --hard HEAD~1

# Deshacer múltiples commits
git reset --soft HEAD~3  # últimos 3 commits
```

### Ver Historial y Volver
```bash
# Ver historial de commits
git log

# Ver historial compacto
git log --oneline

# Ver historial gráfico
git log --graph --oneline --all

# Volver a un commit específico
git checkout <hash-del-commit>
```

---

## 🔍 Inspeccionar y Buscar

### Ver Cambios
```bash
# Ver qué cambió en cada commit
git show <hash-commit>

# Ver archivos cambiados en un commit
git show --name-only <hash-commit>

# Comparar dos branches
git diff main..tu-branch
```

### Buscar en el Código
```bash
# Buscar texto en archivos
git grep "texto-a-buscar"

# Buscar en commits
git log --all --grep="texto"

# Ver quién modificó cada línea
git blame archivo.js
```

---

## 🧹 Limpieza

### Limpiar Archivos No Tracked
```bash
# Ver qué se eliminaría
git clean -n

# Eliminar archivos no tracked
git clean -f

# Eliminar directorios también
git clean -fd
```

### Actualizar .gitignore
```bash
# Si agregaste archivos por error a .gitignore después
git rm --cached archivo.js
git rm --cached -r directorio/
```

---

## 🔧 Configuración Útil

### Aliases (Atajos)
```bash
# Crear atajos personalizados
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --graph --oneline --all"

# Ahora puedes usar:
git st    # en lugar de git status
git co    # en lugar de git checkout
git lg    # log bonito
```

### Configuración de Editor
```bash
# Usar VS Code para commits
git config --global core.editor "code --wait"

# Usar Vim
git config --global core.editor "vim"

# Usar Nano
git config --global core.editor "nano"
```

---

## 🎯 Workflow Completo (Resumen)

```bash
# 1. Actualizar tu main
git checkout main
git pull upstream main

# 2. Crear branch para tu feature
git checkout -b fix/responsive-cards

# 3. Hacer cambios en el código
# (edita archivos en tu editor)

# 4. Ver qué cambiaste
git status
git diff

# 5. Agregar cambios
git add .

# 6. Commit
git commit -m "fix: mejorar responsive en tarjetas"

# 7. Push a tu fork
git push -u origin fix/responsive-cards

# 8. Crear Pull Request en GitHub
# (ir a github.com y seguir el botón verde)

# 9. Si te piden cambios
# (hacer modificaciones)
git add .
git commit -m "fix: aplicar sugerencias del review"
git push

# 10. Después del merge, limpiar
git checkout main
git pull upstream main
git branch -d fix/responsive-cards
```

---

## 🆘 Problemas Comunes

### "Permission denied (publickey)"
```bash
# Verificar que tu SSH key está configurada
ssh -T git@github.com

# O cambiar a HTTPS
git remote set-url origin https://github.com/TU-USUARIO/ranked-vote.git
```

### "Your branch is behind"
```bash
git pull
# o si quieres rebase
git pull --rebase
```

### "Merge conflict"
```bash
# 1. Abrir archivos con conflictos
# 2. Buscar marcadores: <<<<<<<, =======, >>>>>>>
# 3. Resolver manualmente
# 4. Quitar marcadores
# 5. Guardar archivo
# 6. Agregar y continuar
git add archivo-resuelto.js
git commit
```

### "detached HEAD state"
```bash
# Volver a main
git checkout main
```

### Commiteaste en main por error
```bash
# 1. Crear branch con los cambios
git branch fix/mi-feature

# 2. Volver main al estado anterior
git reset --hard upstream/main

# 3. Cambiar a tu nueva branch
git checkout fix/mi-feature
```

---

## 📚 Recursos Adicionales

### Aprender Más:
- **Interactive Tutorial**: learngitbranching.js.org
- **Git Book**: git-scm.com/book/en/v2
- **GitHub Docs**: docs.github.com

### Ayuda Rápida:
```bash
# Ayuda de un comando
git help <comando>
git <comando> --help

# Ejemplos:
git help commit
git push --help
```

---

## 💡 Tips Pro

1. **Commits pequeños y frecuentes** > Un commit gigante
2. **Mensajes descriptivos** > "update", "fix", "changes"
3. **Una feature por PR** > Múltiples features mezcladas
4. **Pull antes de Push** > Evita conflictos
5. **Branch por feature** > Trabajar en main
6. **Review tu código antes de commit** > `git diff`
7. **Prueba localmente antes de push** > Código roto

---

**¡Happy Git-ing!** 🚀

Para más ayuda durante el evento, acude a las estaciones de ayuda.
