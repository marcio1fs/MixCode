@echo off
echo Iniciando Mix Muse Server...
echo.
echo Instalando dependencias...
pip install -r requirements.txt
echo.
echo Iniciando servidor em http://localhost:8000
echo Pressione Ctrl+C para parar
echo.
python server.py
pause 