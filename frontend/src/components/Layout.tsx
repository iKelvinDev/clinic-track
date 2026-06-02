import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}>
            ClinicTrack
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Patients
          </Button>
          <Button color="inherit" onClick={() => navigate('/notifications')}>
            Notifications
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  )
}