@echo off
set "RUTA_BASE=%~dp0"

start cmd /k "cd /d %RUTA_BASE%backend && flask run"
start cmd /k "cd /d %RUTA_BASE%frontend && npm start"
