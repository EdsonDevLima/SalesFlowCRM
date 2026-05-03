@echo off
setlocal

set "ROOT_DIR=%~dp0"

echo Instalando dependencias do backend...
cd /d "%ROOT_DIR%atlas-crm-api"
call npm install
if errorlevel 1 exit /b %errorlevel%

echo Instalando dependencias do frontend...
cd /d "%ROOT_DIR%atlas-crm-front"
call npm install
if errorlevel 1 exit /b %errorlevel%

cd /d "%ROOT_DIR%"
echo Instalacao concluida.
echo Arquivo de ambiente central: %ROOT_DIR%.env
