#!/usr/bin/env python3
"""
Mix Muse Server - FastAPI Backend
Servidor para o plugin Mix Muse que fornece APIs para análise musical de código
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from muse_agent import MuseAgent, MusicStyle, Complexity, suggest_names, analyze_naming_patterns

app = FastAPI(
    title="Mix Muse API",
    description="API para análise musical de código",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class SuggestRequest(BaseModel):
    code: str
    symbols: List[str]
    musicStyle: str = "jazz"
    tempo: int = 120
    complexity: str = "medium"

class AnalyzeRequest(BaseModel):
    code: str
    path: Optional[str] = None
    language: Optional[str] = None

class RealtimeRequest(BaseModel):
    code: str
    changes: List[Dict[str, Any]] = []
    symbols: List[str] = []

class MuseResponse(BaseModel):
    suggestions: List[str]
    musicalPattern: Optional[Dict[str, Any]] = None
    namingSuggestions: Optional[List[str]] = None

@app.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "message": "Mix Muse API",
        "version": "1.0.0",
        "endpoints": [
            "/mixmuse/suggest",
            "/mixmuse/analyze", 
            "/mixmuse/analyze-realtime"
        ]
    }

@app.post("/mixmuse/suggest", response_model=MuseResponse)
async def suggest_improvements(request: SuggestRequest):
    """Sugere melhorias baseadas em análise musical"""
    try:
        # Criar agente musical
        music_style = MusicStyle(request.musicStyle)
        complexity = Complexity(request.complexity)
        agent = MuseAgent(music_style, request.tempo, complexity)
        
        # Analisar código
        analysis = agent.analyze_code(request.code)
        pattern = agent.generate_musical_pattern(analysis)
        
        # Gerar sugestões
        suggestions = []
        
        # Sugestões baseadas no padrão musical
        if analysis.complexity_score > 0.7:
            suggestions.append("Considere simplificar a estrutura do código")
        
        if analysis.loops > 5:
            suggestions.append("Muitos loops detectados - considere usar métodos funcionais")
        
        if analysis.functions > 10:
            suggestions.append("Muitas funções - considere modularizar em classes")
        
        # Sugestões de nomenclatura
        naming_result = suggest_names(request.code, request.symbols)
        naming_suggestions = []
        
        if naming_result.get("suggestions"):
            # Extrair nomes das sugestões
            suggestions_text = naming_result["suggestions"]
            lines = suggestions_text.split('\n')
            for line in lines:
                if ' -> ' in line:
                    new_name = line.split(' -> ')[1].strip()
                    naming_suggestions.append(new_name)
        
        return MuseResponse(
            suggestions=suggestions,
            musicalPattern={
                "rhythm": pattern.rhythm,
                "harmony": pattern.harmony,
                "melody": pattern.melody,
                "structure": pattern.structure,
                "tempo": pattern.tempo,
                "key": pattern.key,
                "timeSignature": pattern.time_signature
            },
            namingSuggestions=naming_suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise: {str(e)}")

@app.post("/mixmuse/analyze", response_model=MuseResponse)
async def analyze_file(request: AnalyzeRequest):
    """Análise inicial de um arquivo"""
    try:
        # Criar agente musical
        agent = MuseAgent(MusicStyle.JAZZ, 120, Complexity.MEDIUM)
        
        # Analisar código
        analysis = agent.analyze_code(request.code)
        pattern = agent.generate_musical_pattern(analysis)
        
        # Gerar sugestões iniciais
        suggestions = []
        
        if analysis.lines > 100:
            suggestions.append("Arquivo longo - considere dividir em módulos")
        
        if analysis.complexity_score > 0.6:
            suggestions.append("Complexidade alta - considere refatorar")
        
        if analysis.functions < 3:
            suggestions.append("Poucas funções - considere extrair lógica")
        
        return MuseResponse(
            suggestions=suggestions,
            musicalPattern={
                "rhythm": pattern.rhythm,
                "harmony": pattern.harmony,
                "melody": pattern.melody,
                "structure": pattern.structure,
                "tempo": pattern.tempo,
                "key": pattern.key,
                "timeSignature": pattern.time_signature
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise: {str(e)}")

@app.post("/mixmuse/analyze-realtime", response_model=MuseResponse)
async def analyze_realtime(request: RealtimeRequest):
    """Análise em tempo real durante edição"""
    try:
        # Criar agente musical
        agent = MuseAgent(MusicStyle.JAZZ, 120, Complexity.MEDIUM)
        
        # Analisar código atual
        analysis = agent.analyze_code(request.code)
        pattern = agent.generate_musical_pattern(analysis)
        
        # Gerar sugestões em tempo real
        suggestions = []
        
        # Analisar mudanças recentes
        if request.changes:
            for change in request.changes:
                if change.get("type") == "insert":
                    suggestions.append("Novo código inserido - verifique a harmonia")
                elif change.get("type") == "delete":
                    suggestions.append("Código removido - ajuste a estrutura")
        
        # Verificar símbolos
        if request.symbols:
            naming_analysis = analyze_naming_patterns(request.code)
            if naming_analysis['total_functions'] > 0:
                suggestions.append("Considere renomear funções para nomes mais musicais")
        
        return MuseResponse(
            suggestions=suggestions,
            musicalPattern={
                "rhythm": pattern.rhythm,
                "harmony": pattern.harmony,
                "melody": pattern.melody,
                "structure": pattern.structure,
                "tempo": pattern.tempo,
                "key": pattern.key,
                "timeSignature": pattern.time_signature
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na análise em tempo real: {str(e)}")

@app.get("/mixmuse/health")
async def health_check():
    """Verificação de saúde da API"""
    return {
        "status": "healthy",
        "service": "Mix Muse API",
        "version": "1.0.0"
    }

@app.get("/mixmuse/styles")
async def get_music_styles():
    """Retorna estilos musicais disponíveis"""
    return {
        "styles": [
            {"value": "jazz", "label": "Jazz", "description": "Improvisação e complexidade"},
            {"value": "classical", "label": "Classical", "description": "Estrutura formal"},
            {"value": "electronic", "label": "Electronic", "description": "Padrões sintetizados"},
            {"value": "rock", "label": "Rock", "description": "Código energético"},
            {"value": "ambient", "label": "Ambient", "description": "Fluxo livre"}
        ]
    }

@app.get("/mixmuse/complexities")
async def get_complexities():
    """Retorna níveis de complexidade disponíveis"""
    return {
        "complexities": [
            {"value": "simple", "label": "Simple", "description": "Código básico"},
            {"value": "medium", "label": "Medium", "description": "Código moderado"},
            {"value": "complex", "label": "Complex", "description": "Código avançado"}
        ]
    }

# Armazenamento simples em memória para sugestões recentes
recent_suggestions = [
    {"original": "process_data", "new": "orchestrateData"},
    {"original": "calculate_sum", "new": "harmonizeValues"},
    {"original": "validate_input", "new": "tuneParameters"},
    {"original": "get_user", "new": "composeUser"},
    {"original": "save_data", "new": "arrangeData"},
    {"original": "check_status", "new": "tuneStatus"},
    {"original": "update_record", "new": "harmonizeRecord"},
    {"original": "delete_item", "new": "resolveItem"}
]

@app.get("/mixmuse/recent")
async def get_recent_suggestions():
    """Retorna sugestões recentes de nomes musicais"""
    return recent_suggestions

class RenameRequest(BaseModel):
    original: str
    newName: str

@app.post("/mixmuse/rename")
async def apply_rename(request: RenameRequest):
    """Simula aplicação de renomeação"""
    original = request.original
    new_name = request.newName
    
    # Aqui você pode implementar lógica real de refatoração
    print(f"🎵 Mix Muse: Renomeando {original} → {new_name}")
    
    # Adicionar à lista de sugestões recentes
    if {"original": original, "new": new_name} not in recent_suggestions:
        recent_suggestions.insert(0, {"original": original, "new": new_name})
        # Manter apenas as últimas 10 sugestões
        if len(recent_suggestions) > 10:
            recent_suggestions.pop()
    
    return {
        "status": "success", 
        "message": f"Renomeado {original} → {new_name}",
        "original": original, 
        "new": new_name
    }

@app.get("/mixmuse/suggestions/count")
async def get_suggestions_count():
    """Retorna o número de sugestões disponíveis"""
    return {
        "count": len(recent_suggestions),
        "total_suggestions": len(recent_suggestions)
    }

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 