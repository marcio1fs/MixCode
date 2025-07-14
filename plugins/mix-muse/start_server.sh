#!/bin/bash

echo "🎵 Iniciando Mix Muse Server..."
echo ""

echo "📦 Instalando dependências..."
pip install -r requirements.txt

echo ""
echo "🚀 Iniciando servidor em http://localhost:8000"
echo "Pressione Ctrl+C para parar"
echo ""

python server.py 