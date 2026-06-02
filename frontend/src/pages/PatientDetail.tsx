import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Paper, Typography, Grid, Chip, TextField, Button,
  CircularProgress, Alert, Divider,
} from '@mui/material'
import { patientApi, evolutionApi } from '../api/client'
import type { Patient, ClinicalEvolution } from '../types'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [description, setDescription] = useState('')
  const [doctorName, setDoctorName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPatient = useCallback(async () => {
    try {
      const { data } = await patientApi.get(id!)
      setPatient(data)
    } catch {
      setError('Erro ao carregar paciente')
    }
  }, [id])

  const fetchEvolutions = useCallback(async (p = 0) => {
    try {
      const { data } = await evolutionApi.list(id!, p, 10)
      if (p === 0) {
        setEvolutions(data.content)
      } else {
        setEvolutions((prev) => [...prev, ...data.content])
      }
      setHasMore(data.pagination.page + 1 < data.pagination.totalPages)
    } catch {
      setError('Erro ao carregar evoluções')
    }
  }, [id])

  useEffect(() => {
    (async () => {
      setLoading(true)
      await Promise.all([fetchPatient(), fetchEvolutions(0)])
      setLoading(false)
    })()
  }, [fetchPatient, fetchEvolutions])

  const handleSubmitEvolution = async () => {
    if (!description.trim()) return
    setSubmitting(true)
    try {
      await evolutionApi.create(id!, { description, doctorName })
      setDescription('')
      setDoctorName('')
      setPage(0)
      await fetchEvolutions(0)
    } catch {
      setError('Erro ao criar evolução')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!patient) {
    return <Alert severity="error">Paciente não encontrado</Alert>
  }

  return (
    <Box>
      <Button sx={{ mb: 2 }} onClick={() => navigate('/')}>
        ← Voltar a listagem
      </Button>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>{patient.name}</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">Email</Typography>
            <Typography>{patient.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">Telefone</Typography>
            <Typography>{patient.phone || '-'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">Data de Nascimento</Typography>
            <Typography>{patient.birthDate || '-'}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(`/patients/${id}/edit`)}>
            Editar Paciente
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>Evoluções Clinicas</Typography>

      {evolutions.length === 0 && (
        <Paper sx={{ p: 3, mb: 2, textAlign: 'center' }}>
          <Typography color="text.secondary">Nenhuma evolução registrada</Typography>
        </Paper>
      )}

      {evolutions.map((evo) => (
        <Paper key={evo.id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip label={evo.doctorName || 'Unknown doctor'} size="small" />
            <Typography variant="caption" color="text.secondary">
              {new Date(evo.createdAt).toLocaleString('pt-BR')}
            </Typography>
          </Box>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{evo.description}</Typography>
          {evo.geminiSummary && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Gemini summary:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {evo.geminiSummary}
              </Typography>
            </Box>
          )}
        </Paper>
      ))}

      {hasMore && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button onClick={() => {
            const next = page + 1
            setPage(next)
            fetchEvolutions(next)
          }}>
            Load more
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Registrar Evolução</Typography>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Descrição" multiline rows={4} required fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Nome do Médico" fullWidth
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)} />
          <Button variant="contained" onClick={handleSubmitEvolution}
            disabled={submitting || !description.trim()}>
            {submitting ? <CircularProgress size={24} /> : 'Adicionar Evolução'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}