'use client';

import axios from "axios"

const api = axios.create({
  baseURL: "https://face-recognition-api-production-1b23.up.railway.app/", // Substitua pela URL da sua API
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

export interface UserData {
  name: string
  cpf: string
}

export interface RegisterRequest {
  nome: string
  cpf: string
  imagemBase64: string
}

export interface LoginRequest {
  imagemBase64: string
  cpf?: string // Opcional para login com referência
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: UserData
}

export const apiService = {
  register: async (data: RegisterRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post("/register", {
        image: data.imagemBase64,
        name: data.nome,
        cpf: data.cpf
      })

      console.log(response.data);

      if (response.data?.error) {
          return { success: false, message: response.data.message }
      }

      return { success: true, message: response.data.message || "Cadastro realizado com sucesso" }
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      return { success: false, message: "Erro ao realizar cadastro" }
    }
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("/remote-check", {
        image: data.imagemBase64,
        method: "for"
      })

      console.log(response.data);

      if (response.data?.access !== "granted") {
          return { success: false, message: "Falha na identificação" }
      }

      return {
        success: true,
        message: "Login realizado com sucesso",
        data: response.data,
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return { success: false, message: "Falha na autenticação" }
    }
  },

  loginWithReference: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("/remote-check", {
        image: data.imagemBase64,
        cpf: data.cpf,
        method: "cpf"
      })

      console.log(response.data);

      if (response.data?.access !== "granted") {
          return { success: false, message: "Falha na identificação" }
      }

      return {
        success: true,
        message: "Login realizado com sucesso",
        data: response.data,
      }
    } catch (error) {
      console.error("Erro ao fazer login com referência:", error)
      return { success: false, message: "Falha na autenticação" }
    }
  },

  smartLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post("/remote-check", {
        image: data.imagemBase64,
        method: "faiss"
      })

      console.log(response.data);

      if (response.data?.access !== "granted") {
          return { success: false, message: "Falha na identificação" }
      }

      return {
        success: true,
        message: "Login inteligente realizado com sucesso",
        data: response.data,
      }
    } catch (error) {
      console.error("Erro ao fazer login inteligente:", error)
      return { success: false, message: "Falha na autenticação" }
    }
  },
}
