import { useContext, useState, type FormEvent } from "react"
import Style from "./auth.module.css"
import { ContextUserApp } from "../../context/contextApp"
import { toast } from "react-toastify"
import { HeaderAuthenticate } from "../../components/headers/authenticateHeader"

export function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [name, setName] = useState<string>("")
  
  const { login, register } = useContext(ContextUserApp)
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLogin) {
      // Login
      if (!email || !password) {
        toast.error("Preencha todos os campos")
        return
      }
      await login(email, password)
    } else {
      // Cadastro
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Preencha todos os campos")
        return
      }
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem")
        return
      }
      await register(name, email, password,confirmPassword)
    }
  }

  return (
    <section className={Style.AuthSection}>
      <HeaderAuthenticate/>
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Entrar" : "Cadastrar-se"}</h2>

        {!isLogin && (
          <label>
            Nome:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </label>
        )}

        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Senha:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {!isLogin && (
          <label>
            Confirmação de senha:
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
            />
          </label>
        )}

        <span 
          onClick={() => setIsLogin(!isLogin)} 
          className={Style.changeModeButton}
        >
          {isLogin ? "Ainda não possuo conta" : "Já possuo conta"}
        </span>

        <input type="submit" value={isLogin ? "Login" : "Cadastrar-se"} />
      </form>
    </section>
  )
}