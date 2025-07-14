

import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const toApiHistory = (messages: ChatMessage[]) => {
    return messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
    }));
};

export const getChatCompletion = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    const apiHistory = toApiHistory(history);
    
    const contents = [...apiHistory, { role: 'user', parts: [{ text: newMessage }] }];

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: `You are MixCode AI, a helpful and expert coding assistant integrated into the MixCode IDE. Your goal is to provide concise, accurate, and helpful answers to user questions about their code. When asked to refactor or write code, provide only the code block in the correct language. When explaining, be clear and use markdown for formatting.`,
        },
    });
    return response.text;
}


export const sendOneTimeMessage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
}

export const forgeModule = async (description: string, projectContext: string): Promise<{ files: {path: string, content: string}[], integrationSuggestion: string }> => {
    const prompt = `Você é um engenheiro de software especialista em IA que cria módulos autocontidos para o projeto de um usuário com base em uma descrição.
Analise a solicitação do usuário e a estrutura do projeto existente para gerar todos os arquivos necessários.

**Solicitação do Usuário:**
${description}

**Caminhos dos Arquivos do Projeto Existente (para contexto):**
${projectContext}

Com base nisso, gere os arquivos para o novo módulo. Garanta que os caminhos dos arquivos sejam relativos à raiz do projeto (ex: "src/components/NewComponent.tsx").
Forneça uma breve sugestão sobre como integrar os novos arquivos ao projeto existente.
Responda no formato JSON solicitado.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    files: {
                        type: Type.ARRAY,
                        description: "Lista de arquivos a serem criados para o módulo.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                path: {
                                    type: Type.STRING,
                                    description: "Caminho completo do arquivo relativo à raiz do projeto, ex: 'src/components/MyComponent.tsx'."
                                },
                                content: {
                                    type: Type.STRING,
                                    description: "O código ou conteúdo completo para o arquivo."
                                }
                            },
                            required: ["path", "content"]
                        }
                    },
                    integrationSuggestion: {
                        type: Type.STRING,
                        description: "Uma sugestão breve e acionável sobre como integrar o novo módulo ao projeto existente (ex: 'Importe NewComponent em App.tsx e adicione-o ao método de renderização.')."
                    }
                },
                 required: ["files", "integrationSuggestion"]
            }
        }
    });

    // The response is a string that needs to be parsed into JSON.
    // The Gemini API with responseSchema ensures it's a valid JSON string.
    const jsonStr = response.text.trim();
    const jsonResponse = JSON.parse(jsonStr);
    return jsonResponse;
}