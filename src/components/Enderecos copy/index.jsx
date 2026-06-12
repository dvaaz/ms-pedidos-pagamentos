import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../../services/api'
import InputField from '../InputField'
import { MapPinIcon, HashIcon, TrashIcon, PencilIcon } from '../icons'
import styles from './Enderecos.module.css'

const EMPTY_FORM = { nome: '', cep: '', rua: '', numero: '', complemento: '' }

export default function Enderecos() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [enderecos, setEnderecos] = useState([])

  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Evita refetch do mesmo CEP (inclusive ao preencher o form na edição).
  const lastFetchedCep = useRef('')

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Lista os endereços do usuário logado (token via interceptor do axios).
  const carregar = useCallback(() => {
    api
      .get('/enderecos')
      .then(({ data }) => setEnderecos(Array.isArray(data) ? data : []))
      .catch(() => setEnderecos([]))
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  // Busca automática no ViaCEP assim que o CEP tiver 8 dígitos.
  useEffect(() => {
    const digits = form.cep.replace(/\D/g, '')
    if (digits.length !== 8) {
      setCepError('')
      return
    }
    if (digits === lastFetchedCep.current) return
    lastFetchedCep.current = digits

    let active = true
    setCepLoading(true)
    setCepError('')
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        if (data.erro) {
          setCepError('CEP não encontrado')
          return
        }
        // Preenche automaticamente a rua.
        setForm((f) => ({ ...f, rua: data.logradouro || f.rua }))
      })
      .catch(() => {
        // Falha de rede (não é "CEP inexistente"): libera o mesmo CEP para nova tentativa.
        lastFetchedCep.current = ''
        if (active) setCepError('CEP não encontrado')
      })
      .finally(() => {
        if (active) setCepLoading(false)
      })

    return () => {
      active = false
    }
  }, [form.cep])

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    lastFetchedCep.current = ''
    setCepError('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const cepDigits = form.cep.replace(/\D/g, '')
    if (cepDigits.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.')
      return
    }

    // Monta o payload conforme a API (numero/complemento opcionais).
    const payload = {
      nome: form.nome,
      cep: cepDigits,
      rua: form.rua,
    }
    if (form.numero !== '') payload.numero = Number(form.numero)
    if (form.complemento !== '') payload.complemento = form.complemento

    setSaving(true)
    try {
      if (editingId != null) {
        await api.put(`/enderecos/${editingId}`, payload)
      } else {
        await api.post('/enderecos', payload)
      }
      resetForm()
      carregar()
    } catch {
      // Mensagem genérica.
      setError('Não foi possível salvar o endereço. Verifique os dados e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(endereco) {
    lastFetchedCep.current = (endereco.cep || '').replace(/\D/g, '')
    setEditingId(endereco.id)
    setForm({
      nome: endereco.nome ?? '',
      cep: endereco.cep ?? '',
      rua: endereco.rua ?? '',
      numero: endereco.numero != null ? String(endereco.numero) : '',
      complemento: endereco.complemento ?? '',
    })
    setCepError('')
    setError('')
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/enderecos/${id}`)
      if (editingId === id) resetForm()
      carregar()
    } catch {
      setError('Não foi possível excluir o endereço. Tente novamente.')
    }
  }

  return (
    <div>
      {editingId != null && <p className={styles.editing}>Editando endereço</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          id="end-nome"
          label="Nome do endereço"
          placeholder="Ex: Casa, Trabalho"
          icon={<MapPinIcon />}
          value={form.nome}
          onChange={(e) => setField('nome', e.target.value)}
          maxLength={50}
          required
        />

        <div>
          <InputField
            id="end-cep"
            label="CEP"
            placeholder="00000-000"
            inputMode="numeric"
            value={form.cep}
            onChange={(e) => setField('cep', e.target.value)}
            required
          />
          {cepLoading && <p className={styles.hint}>Buscando CEP...</p>}
          {cepError && <p className={styles.hintError}>{cepError}</p>}
        </div>

        <InputField
          id="end-rua"
          label="Rua"
          placeholder="Preenchido automaticamente pelo CEP"
          icon={<MapPinIcon />}
          value={form.rua}
          onChange={(e) => setField('rua', e.target.value)}
          maxLength={150}
          required
        />

        <div className={styles.grid2}>
          <InputField
            id="end-numero"
            label="Número (opcional)"
            placeholder="123"
            inputMode="numeric"
            icon={<HashIcon />}
            value={form.numero}
            onChange={(e) => setField('numero', e.target.value.replace(/\D/g, ''))}
          />
          <InputField
            id="end-complemento"
            label="Complemento (opcional)"
            placeholder="Apto, bloco..."
            value={form.complemento}
            onChange={(e) => setField('complemento', e.target.value)}
            maxLength={100}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.actions}>
          <button type="submit" disabled={saving} className={styles.submit}>
            {saving ? 'Salvando...' : editingId != null ? 'Salvar alterações' : 'Adicionar endereço'}
          </button>
          {editingId != null && (
            <button type="button" onClick={resetForm} className={styles.cancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de endereços cadastrados */}
      <div className={styles.list}>
        {enderecos.length === 0 ? (
          <p className={styles.empty}>Nenhum endereço cadastrado.</p>
        ) : (
          <ul className={styles.items}>
            {enderecos.map((end) => (
              <li key={end.id} className={styles.item}>
                <div>
                  <p className={styles.itemName}>{end.nome}</p>
                  <p className={styles.itemDetail}>
                    {end.rua}
                    {end.numero != null ? `, ${end.numero}` : ''}
                    {end.complemento ? ` — ${end.complemento}` : ''}
                  </p>
                  <p className={styles.itemCep}>CEP: {end.cep}</p>
                </div>
                <div className={styles.itemActions}>
                  <button
                    type="button"
                    onClick={() => handleEdit(end)}
                    className={styles.editBtn}
                    aria-label={`Editar ${end.nome}`}
                  >
                    <PencilIcon /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(end.id)}
                    className={styles.deleteBtn}
                    aria-label={`Excluir ${end.nome}`}
                  >
                    <TrashIcon /> Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
