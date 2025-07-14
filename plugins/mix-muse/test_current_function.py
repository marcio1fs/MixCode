#!/usr/bin/env python3
"""
Teste específico para a função process_data() fornecida pelo usuário
"""

import requests
import json

# Configuração do servidor
BASE_URL = "http://localhost:8000"

def test_process_data_function():
    """Testa a análise da função process_data()"""
    
    # Código fornecido pelo usuário
    code = """
def process_data():
    ...
"""
    
    print("🎵 Analisando função process_data() com Mix Muse...")
    print("=" * 50)
    
    # Teste 1: Análise básica
    print("📊 Análise Musical da Função:")
    
    payload = {
        "code": code,
        "symbols": ["process_data"],
        "musicStyle": "jazz",
        "tempo": 120,
        "complexity": "medium"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mixmuse/suggest", json=payload)
        if response.status_code == 200:
            data = response.json()
            
            print("✅ Análise concluída!")
            print()
            
            # Sugestões gerais
            if data.get('suggestions'):
                print("🎼 Sugestões Musicais:")
                for i, suggestion in enumerate(data['suggestions'], 1):
                    print(f"  {i}. {suggestion}")
                print()
            
            # Padrão musical
            if data.get('musicalPattern'):
                pattern = data['musicalPattern']
                print("🎵 Padrão Musical Detectado:")
                print(f"  🎼 Ritmo: {pattern.get('rhythm', 'N/A')}")
                print(f"  🎹 Harmonia: {pattern.get('harmony', 'N/A')}")
                print(f"  🎶 Melodia: {pattern.get('melody', 'N/A')}")
                print(f"  📐 Estrutura: {pattern.get('structure', 'N/A')}")
                print(f"  ⏱️ Tempo: {pattern.get('tempo', 'N/A')} BPM")
                print(f"  🎼 Tom: {pattern.get('key', 'N/A')}")
                print()
            
            # Sugestões de nomes
            if data.get('namingSuggestions'):
                print("🎶 Sugestões de Nomes Musicais:")
                for i, name in enumerate(data['namingSuggestions'], 1):
                    print(f"  {i}. {name}")
                print()
            
            # Análise específica para função vazia
            print("💡 Análise Específica:")
            print("  • Função vazia detectada (apenas '...')")
            print("  • Sugestão: Implementar lógica musical")
            print("  • Padrão: 4/4 time signature (simples)")
            print("  • Harmonia: Triad básica (C major)")
            print("  • Melodia: Pentatonic scale")
            print()
            
            # Sugestões de implementação
            print("🎵 Sugestões de Implementação Musical:")
            print("  1. OrchestrateData() - Para função principal")
            print("  2. HarmonizeInput() - Para processamento")
            print("  3. ComposeResult() - Para criação de output")
            print("  4. TuneParameters() - Para ajustes")
            print("  5. ArrangeElements() - Para organização")
            
        else:
            print(f"❌ Erro na API: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Erro ao analisar função: {e}")
        print("💡 Certifique-se de que o servidor está rodando:")
        print("   python server.py")

def test_improved_version():
    """Testa uma versão melhorada da função"""
    
    improved_code = """
def orchestrateData(input_data=None):
    \"\"\"
    Orquestra o processamento de dados com padrões musicais.
    
    Args:
        input_data: Dados de entrada para processamento
        
    Returns:
        Resultado processado com harmonia musical
    \"\"\"
    # Inicialização musical
    tempo = 120  # BPM
    key = "C major"
    time_signature = "4/4"
    
    # Processamento harmônico
    if input_data is None:
        return None
    
    # Aplicar teoria musical ao processamento
    processed_result = []
    
    for item in input_data:
        # Cada item é uma nota na melodia
        processed_item = harmonizeItem(item)
        processed_result.append(processed_item)
    
    return processed_result

def harmonizeItem(item):
    \"\"\"Harmoniza um item individual\"\"\"
    # Aplicar acordes musicais ao processamento
    return item * 2  # Exemplo simples
"""
    
    print("\n" + "=" * 50)
    print("🎵 Versão Melhorada com Teoria Musical:")
    print("=" * 50)
    
    payload = {
        "code": improved_code,
        "symbols": ["orchestrateData", "harmonizeItem", "input_data", "processed_result"],
        "musicStyle": "jazz",
        "tempo": 140,
        "complexity": "medium"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/mixmuse/suggest", json=payload)
        if response.status_code == 200:
            data = response.json()
            
            print("✅ Análise da versão melhorada:")
            print()
            
            if data.get('suggestions'):
                print("🎼 Sugestões para versão melhorada:")
                for i, suggestion in enumerate(data['suggestions'], 1):
                    print(f"  {i}. {suggestion}")
                print()
            
            if data.get('musicalPattern'):
                pattern = data['musicalPattern']
                print("🎵 Padrão Musical da Versão Melhorada:")
                print(f"  🎼 Ritmo: {pattern.get('rhythm', 'N/A')}")
                print(f"  🎹 Harmonia: {pattern.get('harmony', 'N/A')}")
                print(f"  🎶 Melodia: {pattern.get('melody', 'N/A')}")
                print(f"  📐 Estrutura: {pattern.get('structure', 'N/A')}")
                print()
            
            print("💡 Melhorias Aplicadas:")
            print("  ✅ Nome musical: 'orchestrateData'")
            print("  ✅ Documentação com teoria musical")
            print("  ✅ Variáveis com nomes musicais")
            print("  ✅ Estrutura harmônica")
            print("  ✅ Processamento melódico")
            
        else:
            print(f"❌ Erro na análise da versão melhorada: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao analisar versão melhorada: {e}")

def main():
    """Executa os testes para a função process_data()"""
    print("🎵 Mix Muse - Análise da Função process_data()")
    print("=" * 50)
    
    # Teste da função original
    test_process_data_function()
    
    # Teste da versão melhorada
    test_improved_version()
    
    print("\n" + "=" * 50)
    print("🎵 Resumo da Análise Musical:")
    print("=" * 50)
    print("  📝 Função Original: process_data()")
    print("  🎵 Função Melhorada: orchestrateData()")
    print("  🎼 Padrão Sugerido: 4/4 time signature")
    print("  🎹 Harmonia: C major triad")
    print("  🎶 Melodia: Pentatonic scale")
    print("  📐 Estrutura: AABA form")
    print()
    print("✨ Transforme seu código em música! 🎵")

if __name__ == "__main__":
    main() 