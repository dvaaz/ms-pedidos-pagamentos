import { useState } from 'react'
import api from '../../services/api'
import InputField from '../InputField'
import { LockIcon, EyeIcon, EyeOffIcon } from '../icons'
import styles from './AlterarSenha.module.css'

// Campo de senha com botão mostrar/ocultar (cada campo controla seu próprio estado).
function PasswordField({ id, label, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <InputField
      id={id}
      type={show ? 'text' : 'password'}
      label={label}
      placeholder="••••••••"
      icon={<LockIcon />}
      value={value}
      onChange={onChange}
      autoComplete="new-password"
      minLength={8}
      required
      trailing={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className={styles.toggle}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  )
}

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validação local: confirmação precisa bater com a nova senha.
    if (novaSenha !== confirmar) {
      setError('A confirmação não corresponde à nova senha.')
      return
    }

    setLoading(true)
    try {
      await api.patch('/usuarios/me/senha', {
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmar('')
      setSuccess('Senha alterada com sucesso.')
    } catch {
      // Mensagem genérica — nunca detalhar o que falhou.
      setError('Não foi possível alterar a senha. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PasswordField
        id="senha-atual"
        label="Senha atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
      />
      <PasswordField
        id="nova-senha"
        label="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />
      <PasswordField
        id="confirmar-senha"
        label="Confirmar nova senha"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className={styles.success} role="status">
          {success}
        </p>
      )}

      <button type="submit" disabled={loading} className={styles.submit}>
        {loading ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </form>
  )
}
