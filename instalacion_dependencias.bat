@echo off
setlocal enabledelayedexpansion

REM === Ruta base del proyecto ===
set "BASE_DIR=%~dp0"

REM === BACKEND ===
echo Instalando entorno backend...
cd /d "%BASE_DIR%backend"

REM Crear entorno virtual si no existe
if not exist "venv\" (
    python -m venv venv
)

call venv\Scripts\activate

REM Actualizar pip y luego instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

flask run


REM === FRONTEND ===
echo Instalando entorno frontend...
cd /d "%BASE_DIR%frontend"

if exist "package.json" (
    npm install
) else (
    echo [ERROR] No se encontró package.json en frontend
    exit /b 1
)

echo.
echo ✅ Instalación completada correctamente.

