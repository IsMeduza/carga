@echo off
REM ==========================================
REM SCRIPT DE BUILD PARA PRODUCCIÓN (Windows)
REM ==========================================

echo [93m🚀 Iniciando build de producción...[0m

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [91m❌ Node.js no está instalado[0m
    exit /b 1
)

cd ..\frontend

REM Verificar que estamos en la carpeta correcta
if not exist "package.json" (
    echo [91m❌ Error: No se encontró package.json[0m
    echo Ejecuta este script desde la carpeta scripts\
    exit /b 1
)

echo [93m📦 Instalando dependencias...[0m
call npm ci

echo [93m🔨 Limpiando build anterior...[0m
if exist build rmdir /s /q build

echo [93m🏗️  Construyendo aplicación...[0m
set NODE_ENV=production
call npm run build

REM Verificar que se generó el build
if not exist "build" (
    echo [91m❌ Error: No se generó la carpeta build\[0m
    exit /b 1
)

echo [93m📁 Copiando archivos de configuración...[0m
if exist "..\.htaccess" (
    copy "..\.htaccess" "build\" >nul
    echo [92m✅ .htaccess copiado[0m
)

echo [92m✅ Build completado exitosamente![0m
echo.
echo 📂 Ubicación: %cd%\build\
echo.
echo Próximos pasos:
echo   1. Prueba local: npx serve -s build
echo   2. Sube la carpeta build\ a tu servidor
echo   3. Configura el dominio y SSL
echo.

pause
