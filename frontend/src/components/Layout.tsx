import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import PeopleIcon from '@mui/icons-material/People'
import NotificationsIcon from '@mui/icons-material/Notifications'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary" sx={{ bgcolor: '#1565c0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}>
            <MonitorHeartIcon />
            <Typography variant="h6">ClinicTrack</Typography>
          </Box>
          <Button color="inherit" startIcon={<PeopleIcon />} onClick={() => navigate('/')}>
            Pacientes
          </Button>
          <Button color="inherit" startIcon={<NotificationsIcon />} onClick={() => navigate('/notifications')}>
            Notificações
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  )
}