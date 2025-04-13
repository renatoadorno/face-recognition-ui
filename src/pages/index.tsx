import { Link } from 'waku';
import { Button } from "../components/ui/button"
import { UserCircle, LogIn, FileCheck, Brain } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Face Recognition
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Teste de viabilidade.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link to="/cadastro" className="w-full">
            <Button
              variant="outline"
              className="w-full h-24 text-lg flex flex-col items-center justify-center gap-2 p-6"
            >
              <UserCircle className="h-8 w-8" />
              <span>Cadastro</span>
            </Button>
          </Link>

          <Link to="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full h-24 text-lg flex flex-col items-center justify-center gap-2 p-6"
            >
              <LogIn className="h-8 w-8" />
              <span>Login</span>
            </Button>
          </Link>

          <Link to="/login-referencia" className="w-full">
            <Button
              variant="outline"
              className="w-full h-24 text-lg flex flex-col items-center justify-center gap-2 p-6"
            >
              <FileCheck className="h-8 w-8" />
              <span>Login com Referência</span>
            </Button>
          </Link>

          <Link to="/login-inteligente" className="w-full">
            <Button
              variant="outline"
              className="w-full h-24 text-lg flex flex-col items-center justify-center gap-2 p-6"
            >
              <Brain className="h-8 w-8" />
              <span>Login Inteligente</span>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
