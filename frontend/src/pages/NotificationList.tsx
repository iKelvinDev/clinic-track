import { useState, useEffect, useCallback } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, Box, CircularProgress, Alert,
} from '@mui/material'
import { notificationApi } from '../api/client'
import type { Notification } from '../types'

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await notificationApi.list(page, size)
      setNotifications(data.content)
      setTotalElements(data.pagination.totalElements)
    } catch {
      setError('Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [page, size])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Notificações</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mensagem</TableCell>
              <TableCell>ID do Paciente</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography color="text.secondary">
                    Nenhuma notificação encontrada
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>{notif.message}</TableCell>
                  <TableCell>{notif.patientId}</TableCell>
                  <TableCell>
                    {new Date(notif.createdAt).toLocaleString('pt-BR')}
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
    </Box>
  )
}