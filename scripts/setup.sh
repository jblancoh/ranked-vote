#!/bin/bash

# 🌺 Vota Flor - Setup Script
# Este script configura el proyecto completo automáticamente

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

print_header() {
    echo -e "${GREEN}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  🌺 Vota Flor - Setup Automático"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${NC}"
}

# Check if Node.js is installed
check_node() {
    print_info "Verificando Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18+ primero."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js versión 18 o superior es requerida. Versión actual: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) detectado"
}

# Check if npm is installed
check_npm() {
    print_info "Verificando npm..."
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado."
        exit 1
    fi
    print_success "npm $(npm -v) detectado"
}

# Setup Frontend
setup_frontend() {
    print_info "Configurando Frontend..."
    
    cd frontend
    
    # Install dependencies
    print_info "Instalando dependencias del frontend..."
    npm install
    
    # Copy env file
    if [ ! -f .env ]; then
        print_info "Creando archivo .env..."
        cp .env.example .env
        print_warning "Por favor edita frontend/.env con tus variables de entorno"
    else
        print_warning "frontend/.env ya existe, saltando..."
    fi
    
    cd ..
    print_success "Frontend configurado"
}

# Setup Backend
setup_backend() {
    print_info "Configurando Backend..."
    
    cd backend
    
    # Install dependencies
    print_info "Instalando dependencias del backend..."
    npm install
    
    # Copy env file
    if [ ! -f .env ]; then
        print_info "Creando archivo .env..."
        cp .env.example .env
        print_warning "Por favor edita backend/.env con tu DATABASE_URL de Supabase"
    else
        print_warning "backend/.env ya existe, saltando..."
    fi
    
    # Generate Prisma Client
    print_info "Generando Prisma Client..."
    npm run prisma:generate
    
    cd ..
    print_success "Backend configurado"
}

# Setup Database
setup_database() {
    print_info "¿Deseas configurar la base de datos ahora? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cd backend
        
        print_warning "Asegúrate de tener tu DATABASE_URL configurada en backend/.env"
        print_info "Presiona Enter para continuar o Ctrl+C para cancelar..."
        read -r
        
        # Run migrations
        print_info "Ejecutando migraciones..."
        npm run prisma:migrate
        
        # Seed database
        print_info "¿Deseas poblar la base de datos con datos de ejemplo? (y/n)"
        read -r seed_response
        
        if [[ "$seed_response" =~ ^[Yy]$ ]]; then
            print_info "Poblando base de datos..."
            npm run prisma:seed
            print_success "Base de datos poblada con datos de ejemplo"
        fi
        
        cd ..
        print_success "Base de datos configurada"
    else
        print_warning "Saltando configuración de base de datos"
        print_info "Puedes configurarla más tarde con:"
        echo "  cd backend"
        echo "  npm run prisma:migrate"
        echo "  npm run prisma:seed"
    fi
}

# Create helpful scripts
create_dev_scripts() {
    print_info "Creando scripts de desarrollo..."
    
    # Create start-dev.sh
    cat > start-dev.sh << 'EOF'
#!/bin/bash
# Start both frontend and backend in development mode

echo "🌺 Starting Vota Flor in development mode..."

# Start backend
echo "Starting Backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
    
    chmod +x start-dev.sh
    print_success "Script start-dev.sh creado"
}

# Final instructions
print_final_instructions() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  🎉 ¡Setup Completado!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📋 Próximos Pasos:${NC}"
    echo ""
    echo -e "1. Configura tus variables de entorno:"
    echo -e "   - Edita: ${YELLOW}frontend/.env${NC}"
    echo -e "   - Edita: ${YELLOW}backend/.env${NC}"
    echo ""
    echo -e "2. Si no lo hiciste, configura la base de datos:"
    echo -e "   ${YELLOW}cd backend${NC}"
    echo -e "   ${YELLOW}npm run prisma:migrate${NC}"
    echo -e "   ${YELLOW}npm run prisma:seed${NC}"
    echo ""
    echo -e "3. Inicia el proyecto en modo desarrollo:"
    echo ""
    echo -e "   Opción A - Todo junto:"
    echo -e "   ${YELLOW}./start-dev.sh${NC}"
    echo ""
    echo -e "   Opción B - Separado (2 terminales):"
    echo -e "   Terminal 1: ${YELLOW}cd backend && npm run dev${NC}"
    echo -e "   Terminal 2: ${YELLOW}cd frontend && npm run dev${NC}"
    echo ""
    echo -e "4. Abre tu navegador:"
    echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
    echo -e "   Backend API: ${YELLOW}http://localhost:5001${NC}"
    echo ""
    echo -e "${BLUE}📚 Recursos:${NC}"
    echo -e "   - Documentación: ${YELLOW}./docs/${NC}"
    echo -e "   - Contribuir: ${YELLOW}./CONTRIBUTING.md${NC}"
    echo -e "   - Issues: ${YELLOW}https://github.com/dev-night-talk/vota-flor/issues${NC}"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
    echo ""
}

# Main execution
main() {
    print_header
    
    # Check prerequisites
    check_node
    check_npm
    
    echo ""
    
    # Setup components
    setup_frontend
    echo ""
    setup_backend
    echo ""
    setup_database
    echo ""
    create_dev_scripts
    
    # Final instructions
    print_final_instructions
}

# Run main function
main