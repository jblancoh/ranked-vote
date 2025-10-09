#!/bin/bash

# 🗳️ Ranked Vote - Configuración Automática
# Este script instala y configura TODO automáticamente
# Solo necesitas ejecutarlo una vez

set -e  # Detener si hay errores

# Colores para mensajes bonitos
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # Sin color

# Funciones para imprimir mensajes
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${PURPLE}▶️  $1${NC}"
}

print_header() {
    clear
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════╗"
    echo "║                                            ║"
    echo "║      🗳️ Ranked Vote - Instalación Fácil     ║"
    echo "║                                            ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

# Verificar Node.js
check_node() {
    print_step "Paso 1/6: Verificando Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js NO está instalado"
        echo ""
        echo "Por favor descarga e instala Node.js desde:"
        echo "👉 https://nodejs.org (versión LTS recomendada)"
        echo ""
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Necesitas Node.js versión 18 o superior"
        echo "Tienes: $(node -v)"
        echo "Descarga la última versión desde: https://nodejs.org"
        exit 1
    fi

    print_success "Node.js $(node -v) instalado correctamente"
}

# Verificar npm
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    print_success "npm $(npm -v) disponible"
}

# Configurar Frontend
setup_frontend() {
    print_step "Paso 2/6: Instalando Frontend (interfaz web)..."

    cd frontend

    print_info "Descargando dependencias del frontend..."
    npm install --silent

    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Archivo Environment de configuración frontend creado"
    else
        print_info "Environment de configuración frontend ya existe ✓"
    fi

    cd ..
    print_success "Frontend instalado correctamente"
}

# Configurar Backend
setup_backend() {
    print_step "Paso 3/6: Instalando Backend (servidor)..."

    cd backend

    print_info "Descargando dependencias del backend..."
    npm install --silent

    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Archivo Environment de configuración backend creado"
        print_warning "Necesitarás configurar tu base de datos en: backend/.env"
    else
        print_info "Environment de configuración de backend ya existe ✓"
    fi

    # Generar Prisma Client
    print_info "Preparando base de datos..."
    npm run prisma:generate --silent

    cd ..
    print_success "Backend instalado correctamente"
}

# Configurar Base de Datos
setup_database() {
    print_step "Paso 4/6: Configurando Base de Datos..."
    echo ""
    print_warning "⚠️  IMPORTANTE: Necesitas una base de datos PostgreSQL"
    echo ""
    echo "Opciones disponibles:"
    echo "  1. Usar Supabase (gratis, en la nube) - RECOMENDADO"
    echo "  2. Usar PostgreSQL local (si ya lo tienes instalado)"
    echo "  3. Configurar más tarde"
    echo ""
    echo -n "¿Qué opción prefieres? (1/2/3): "
    read -r db_option

    case $db_option in
        1)
            echo ""
            print_info "📚 Para usar Supabase (GRATIS):"
            echo "   1. Abre: https://supabase.com"
            echo "   2. Crea una cuenta (gratis)"
            echo "   3. Crea un nuevo proyecto"
            echo "   4. Ve a Settings → Database"
            echo "   5. Copia la 'Connection String' (URI mode)"
            echo ""
            echo -n "¿Ya tienes tu URL de Supabase? (y/n): "
            read -r has_url

            if [[ "$has_url" =~ ^[Yy]$ ]]; then
                echo -n "Pega tu DATABASE_URL aquí: "
                read -r db_url

                cd backend
                # Actualizar .env con la URL
                if grep -q "^DATABASE_URL=" .env; then
                    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
                else
                    echo "DATABASE_URL=\"$db_url\"" >> .env
                fi
                rm -f .env.bak

                print_success "URL de base de datos configurada"

                # Ejecutar migraciones
                print_info "Creando tablas en la base de datos..."
                npm run prisma:migrate dev --name init_setup

                print_info "Agregando datos de ejemplo..."
                npm run prisma:seed

                cd ..
                print_success "Base de datos lista para usar"
            else
                print_warning "Configura tu DATABASE_URL en backend/.env cuando estés listo"
            fi
            ;;
        2)
            echo ""
            print_info "Para PostgreSQL local:"
            echo "   Tu URL será algo como:"
            echo "   postgresql://postgres:tu_password@localhost:5432/ranked_vote"
            echo ""
            echo -n "¿Ya creaste la base de datos 'ranked_vote'? (y/n): "
            read -r db_exists

            if [[ ! "$db_exists" =~ ^[Yy]$ ]]; then
                print_info "Ejecuta estos comandos primero:"
                echo "   psql -U postgres"
                echo "   CREATE DATABASE ranked_vote;"
                echo "   \\q"
                echo ""
                print_warning "Luego ejecuta este script de nuevo"
                exit 0
            fi

            echo -n "Pega tu DATABASE_URL: "
            read -r db_url

            cd backend
            if grep -q "^DATABASE_URL=" .env; then
                sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
            else
                echo "DATABASE_URL=\"$db_url\"" >> .env
            fi
            rm -f .env.bak

            print_info "Creando tablas..."
            npm run prisma:migrate dev --name init_setup

            print_info "Agregando datos de ejemplo..."
            npm run prisma:seed

            cd ..
            print_success "Base de datos configurada"
            ;;
        3)
            print_warning "Base de datos no configurada"
            echo ""
            print_info "Cuando estés listo, sigue la guía en:"
            echo "   docs/SETUP_MULTITENANT.md"
            ;;
        *)
            print_error "Opción inválida"
            exit 1
            ;;
    esac
}

# Crear script de inicio
create_start_script() {
    print_step "Paso 5/6: Creando script de inicio rápido..."

    # El script ya existe en scripts/start-dev.sh
    if [ -f "scripts/start-dev.sh" ]; then
        chmod +x scripts/start-dev.sh
        print_success "Script de inicio listo"
    else
        print_warning "Script de inicio no encontrado"
    fi
}

# Instrucciones finales
print_final_instructions() {
    print_step "Paso 6/6: ¡Todo listo! 🎉"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                            ║${NC}"
    echo -e "${GREEN}║         ✨ INSTALACIÓN COMPLETADA ✨       ║${NC}"
    echo -e "${GREEN}║                                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""

    # Verificar si la BD está configurada
    if grep -q "^DATABASE_URL=\"postgresql://" backend/.env 2>/dev/null; then
        DB_CONFIGURED=true
    else
        DB_CONFIGURED=false
    fi

    if [ "$DB_CONFIGURED" = true ]; then
        echo -e "${GREEN}✅ Todo configurado y listo para usar${NC}"
        echo ""
        echo -e "${BLUE}🚀 Para iniciar el proyecto:${NC}"
        echo ""
        echo -e "   ${YELLOW}./scripts/start-dev.sh${NC}"
        echo ""
        echo -e "${BLUE}📱 Luego abre tu navegador en:${NC}"
        echo -e "   ${YELLOW}http://localhost:5173${NC}"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Falta configurar la base de datos${NC}"
        echo ""
        echo -e "${BLUE}Pasos finales:${NC}"
        echo ""
        echo "1. Configura tu base de datos en:"
        echo -e "   ${YELLOW}backend/.env${NC}"
        echo ""
        echo "2. Ejecuta las migraciones:"
        echo -e "   ${YELLOW}cd backend${NC}"
        echo -e "   ${YELLOW}npm run prisma:migrate dev${NC}"
        echo -e "   ${YELLOW}npm run prisma:seed${NC}"
        echo ""
        echo "3. Inicia el proyecto:"
        echo -e "   ${YELLOW}cd ..${NC}"
        echo -e "   ${YELLOW}./scripts/start-dev.sh${NC}"
        echo ""
    fi

    echo -e "${BLUE}📚 Ayuda adicional:${NC}"
    echo -e "   Documentación completa: ${YELLOW}docs/SETUP_MULTITENANT.md${NC}"
    echo -e "   Script de inicio: ${YELLOW}./scripts/start-dev.sh${NC}"
    echo ""
    echo -e "${GREEN}¡Gracias por usar Ranked Vote! 🗳️${NC}"
    echo ""
}

# Ejecución principal
main() {
    print_header

    # Verificar prerequisitos
    check_node
    check_npm

    echo ""

    # Instalar componentes
    setup_frontend
    echo ""
    setup_backend
    echo ""
    setup_database
    echo ""
    create_start_script

    echo ""

    # Instrucciones finales
    print_final_instructions
}

# Ejecutar
main