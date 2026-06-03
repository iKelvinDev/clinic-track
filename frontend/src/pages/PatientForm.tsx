import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert, } from '@mui/material'
import { patientApi } from '../api/client'
import { formatPhone, sanitizeName, formatEmail } from '../utils/masks'
import type { PatientRequest } from '../types'

export default function PatientForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<PatientRequest>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!id) return
    (async () => {
      try {
        const { data } = await patientApi.get(id)
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          birthDate: data.birthDate || '',
        })
      } catch {
        setError('Erro ao carregar dados do paciente')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Nome é obrigatório'
    if (!form.email.trim()) errs.email = 'Email é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await patientApi.update(id!, form)
      } else {
        await patientApi.create(form)
      }
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar paciente')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {isEdit ? 'Editar Paciente' : 'Novo Paciente'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" required fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: sanitizeName(e.target.value) })}
            error={!!errors.name} helperText={errors.name} />

          <TextField label="Email" required fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: formatEmail(e.target.value) })}
            error={!!errors.email} helperText={errors.email} />

          <TextField label="Telefone" fullWidth
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} />

          <TextField label="Data de Nascimento" type="date" fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit}
              disabled={saving}>
              {saving ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}