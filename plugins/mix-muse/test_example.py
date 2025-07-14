#!/usr/bin/env python3
"""
Exemplo de teste para o plugin Mix Muse
Demonstra como usar as APIs do servidor
"""

import requests
import json

# Configuração do servidor
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Testa se o servidor está funcionando"""
    try:
        response = requests.get(f"{BASE_URL}/mixmuse/health")
        print("✅ Servidor está funcionando!")
        print(f"Status: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Erro ao conectar com o servidor: {e}")
        return False

def test_suggest_improvements():
    """Testa a API de sugestões"""
    code = """
def process_data(data):
    result = []
    for item in data:
        if item.type == 'user':
            for subitem in item.items:
                if subitem.active:
                    result.append(subitem.value)
    return result
"""
    
    payload = {
        "code": code,
        "symbols": ["process_data", "data", "result", "item", "subitem"],
        "musicStyle": "jazz",
        "tempo": 120,
        "complexity": "medium"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mixmuse/suggest", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("🎵 Sugestões do Mix Muse:")
            print(f"  Sugestões: {data.get('suggestions', [])}")
            if data.get('musicalPattern'):
                pattern = data['musicalPattern']
                print(f"  Ritmo: {pattern.get('rhythm')}")
                print(f"  Harmonia: {pattern.get('harmony')}")
                print(f"  Melodia: {pattern.get('melody')}")
            if data.get('namingSuggestions'):
                print(f"  Nomes musicais: {data['namingSuggestions']}")
        else:
            print(f"❌ Erro na API: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao testar sugestões: {e}")

def test_analyze_file():
    """Testa a API de análise de arquivo"""
    code = """
class UserManager:
    def __init__(self):
        self.users = []
    
    def add_user(self, user):
        self.users.append(user)
    
    def get_user(self, user_id):
        for user in self.users:
            if user.id == user_id:
                return user
        return None
"""
    
    payload = {
        "code": code,
        "path": "user_manager.py",
        "language": "python"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mixmuse/analyze", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("📊 Análise do arquivo:")
            print(f"  Sugestões: {data.get('suggestions', [])}")
            if data.get('musicalPattern'):
                pattern = data['musicalPattern']
                print(f"  Estrutura: {pattern.get('structure')}")
                print(f"  Tempo: {pattern.get('tempo')} BPM")
                print(f"  Tom: {pattern.get('key')}")
        else:
            print(f"❌ Erro na análise: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao analisar arquivo: {e}")

def test_realtime_analysis():
    """Testa a API de análise em tempo real"""
    code = """
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price;
    }
    return total;
}
"""
    
    payload = {
        "code": code,
        "changes": [
            {"type": "insert", "line": 3, "text": "let total = 0;"}
        ],
        "symbols": ["calculateTotal", "items", "total", "item", "price"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mixmuse/analyze-realtime", json=payload)
        if response.status_code == 200:
            data = response.json()
            print("⏱️ Análise em tempo real:")
            print(f"  Sugestões: {data.get('suggestions', [])}")
            if data.get('musicalPattern'):
                pattern = data['musicalPattern']
                print(f"  Padrão atual: {pattern.get('rhythm')}")
        else:
            print(f"❌ Erro na análise em tempo real: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro na análise em tempo real: {e}")

def test_music_styles():
    """Testa a API de estilos musicais"""
    try:
        response = requests.get(f"{BASE_URL}/mixmuse/styles")
        if response.status_code == 200:
            styles = response.json()
            print("🎼 Estilos musicais disponíveis:")
            for style in styles['styles']:
                print(f"  {style['label']}: {style['description']}")
        else:
            print(f"❌ Erro ao obter estilos: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao obter estilos: {e}")

def main():
    """Executa todos os testes"""
    print("🎵 Testando Mix Muse Plugin")
    print("=" * 40)
    
    # Teste de saúde
    if not test_health_check():
        print("❌ Servidor não está funcionando. Execute 'python server.py' primeiro.")
        return
    
    print("\n" + "=" * 40)
    
    # Teste de sugestões
    test_suggest_improvements()
    
    print("\n" + "=" * 40)
    
    # Teste de análise de arquivo
    test_analyze_file()
    
    print("\n" + "=" * 40)
    
    # Teste de análise em tempo real
    test_realtime_analysis()
    
    print("\n" + "=" * 40)
    
    # Teste de estilos musicais
    test_music_styles()
    
    print("\n" + "=" * 40)
    print("✅ Testes concluídos!")

if __name__ == "__main__":
    main() 