#!/bin/bash

# 🗳️ Ranked Vote - Inicio Rápido
# Este script inicia el frontend y backend automáticamente

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Función para detener procesos al salir
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
    exit 0
}

# Capturar señal de interrupción (Ctrl+C)
trap cleanup INT TERM

# Header
clear
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════╗"
echo "║                                            ║"
echo "║      🗳️ Ranked Vote - Inicio en Desarrollo  ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Verificar si los puertos ya están en uso
if check_port 5001; then
    echo -e "${RED}❌ El puerto 5001 (backend) ya está en uso${NC}"
    echo "   Detén el proceso que lo está usando o cierra el servidor anterior"
    exit 1
fi

if check_port 5173; then
    echo -e "${RED}❌ El puerto 5173 (frontend) ya está en uso${NC}"
    echo "   Detén el proceso que lo está usando o cierra el servidor anterior"
    exit 1
fi

# Verificar que existe la configuración del backend
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ No se encontró backend/.env${NC}"
    echo "   Ejecuta primero: ./scripts/setup.sh"
    exit 1
fi

# Verificar que la base de datos está configurada
if ! grep -q "^DATABASE_URL=\"postgresql://" backend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  La base de datos no está configurada${NC}"
    echo ""
    echo "Configura tu DATABASE_URL en: backend/.env"
    echo "Luego ejecuta:"
    echo "  cd backend"
    echo "  npm run prisma:migrate dev"
    echo "  npm run prisma:seed"
    exit 1
fi

# Iniciar Backend
echo -e "${BLUE}▶️  Iniciando Backend (API)...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend inicie
echo "   Esperando al servidor..."
sleep 4

# Verificar que el backend inició correctamente
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ El backend falló al iniciar${NC}"
    echo "   Ver logs en: backend.log"
    cat backend.log
    exit 1
fi

echo -e "${GREEN}✅ Backend corriendo en http://localhost:5001${NC}"

# Iniciar Frontend
echo -e "${BLUE}▶️  Iniciando Frontend (Interfaz Web)...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Esperar a que el frontend inicie
sleep 3

# Verificar que el frontend inició correctamente
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}❌ El frontend falló al iniciar${NC}"
    echo "   Ver logs en: frontend.log"
    cat frontend.log
    cleanup
    exit 1
fi

echo -e "${GREEN}✅ Frontend corriendo en http://localhost:5173${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✨ ¡Todo listo!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Abre tu navegador en:${NC}"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}🔧 API disponible en:${NC}"
echo -e "   ${YELLOW}http://localhost:5001${NC}"
echo ""
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener ambos servicios${NC}"
echo ""

# Esperar por ambos procesos
wait $BACKEND_PID $FRONTEND_PID