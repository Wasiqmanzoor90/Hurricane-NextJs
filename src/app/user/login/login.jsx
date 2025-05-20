import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

function Login() {
    return (
        <Container style={{ width: '350px' }}>



            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px',
                    border: '1px solid black',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    marginTop: '100px',

                }}>

                <Typography variant='h5' gutterBottom alignSelf='flex-start' fontWeight='600'>
                    Sign in
                </Typography>
                <Typography variant='body2' color='textSecondary' gutterBottom alignSelf='flex-start'>
                    Stay updated on your professional world
                </Typography>

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email or Phone"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                />
                <Link href="#" style={{ alignSelf: 'flex-start', marginTop: '10px', textDecoration:'none', fontWeight:'300' }}>
                    Forgot Password
                </Link>
                <Button variant='contained' sx={{ marginTop: '15px', borderRadius: '12px' }} fullWidth>
                    Login
                </Button>
                <Typography variant='body2' sx={{ margin: '15px 0' }}>
                    or
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<FontAwesomeIcon icon={faGithub}
                        style={{ color: 'black', fontSize: '30px' }} />}
                    sx={{
                        color: 'black',               // Text color
                        borderColor: 'black',         // Outline color
                        borderRadius: '12px',
                        marginBottom: '10px',
                    }}
                >
                    Sign in with GitHub
                </Button>

            </Box>


        </Container>
    )
}

export default Login