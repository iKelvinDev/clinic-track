import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Button, IconButton, Typography, Box,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { patientApi } from '../api/client'
import type { Patient } from '../types'

export default function PatientList() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string }>({
    open: false,
    id: '',
  })

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await patientApi.list(page, size)
      setPatients(data.content)
      setTotalElements(data.pagination.totalElements)
    } catch {
      setError('Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }, [page, size])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleDelete = async () => {
    try {
      await patientApi.delete(deleteDialog.id)
      setDeleteDialog({ open: false, id: '' })
      fetchPatients()
    } catch {
      setError('Erro ao deletar paciente')
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Pacientes</Typography>
        <Button variant="contained" startIcon={<AddIcon />}
          onClick={() => navigate('/patients/new')}>
          Novo Paciente
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">
                    Nenhum paciente encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone || '-'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton onClick={() => navigate(`/patients/${patient.id}`)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => navigate(`/patients/${patient.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar">
                      <IconButton onClick={() => setDeleteDialog({ open: true, id: patient.id })}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={size}
        rowsPerPageOptions={[size]}
      />

      <Dialog open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: '' })}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você tem certeza que deseja deletar este paciente? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: '' })}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}