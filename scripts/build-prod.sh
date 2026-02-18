#!/bin/bash
# ==========================================
# SCRIPT DE BUILD PARA PRODUCCIÓN
# ==========================================

set -e  # Detenerse si hay error

echo "🚀 Iniciando build de producción..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

cd ../frontend

# 1. Verificar que estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Este script debe ejecutarse desde la carpeta scripts/"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm ci --silent

echo -e "${YELLOW}🔨 Limpiando build anterior...${NC}"
rm -rf build/

echo -e "${YELLOW}🏗️  Construyendo aplicación...${NC}"
NODE_ENV=production npm run build

echo -e "${YELLOW}📋 Verificando build...${NC}"
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: No se generó la carpeta build/${NC}"
    exit 1
fi

# 2. Copiar archivos necesarios
echo -e "${YELLOW}📁 Copiando archivos de configuración...${NC}"

# Crear .htaccess en build si existe en raíz
if [ -f "../.htaccess" ]; then
    cp ../.htaccess build/.htaccess
    echo "✅ .htaccess copiado"
fi

# 3. Generar reporte de tamaños
echo -e "${YELLOW}📊 Generando reporte...${NC}"
echo "Tamaño del build:" > build/build-info.txt
echo "==================" >> build/build-info.txt
du -sh build/ >> build/build-info.txt
echo "" >> build/build-info.txt
echo "Archivos JS principales:" >> build/build-info.txt
echo "========================" >> build/build-info.txt
find build/static -name "*.js" -exec ls -lh {} \; | awk '{ print $9 ": " $5 }' >> build/build-info.txt

echo -e "${GREEN}✅ Build completado exitosamente!${NC}"
echo ""
echo -e "${GREEN}📂 Ubicación: $(pwd)/build/${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Prueba local: npx serve -s build"
echo "  2. Sube la carpeta build/ a tu servidor"
echo "  3. Configura el dominio y SSL"
echo ""

# Abir carpeta build (macOS/Linux)
if command -v open &> /dev/null; then
    open build/
elif command -v xdg-open &> /dev/null; then
    xdg-open build/
fi
