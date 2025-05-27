import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from "next/navigation"; // new one
import React from 'react'

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const formData = { email, password };
    const router = useRouter();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const url = "/api/user/login"; // ✅ assuming the file is: app/api/user/login/route.js

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("name", data.user.username);
               
                setTimeout(() => {
                    router.push("/Todo/dashboard");
                }, 2000);
            }
        } catch (error) {
            console.log("Error during login:", error);
        }

    }

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Link href="#" style={{ alignSelf: 'flex-start', marginTop: '10px', textDecoration: 'none', fontWeight: '300' }}>
                    Forgot Password
                </Link>
                <Button variant='contained' sx={{ marginTop: '15px', borderRadius: '12px' }} fullWidth
                    onClick={handleLogin}>
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

                <Link href='/user/register' style={{ textDecoration: 'none', padding: '3px' }}>Register here</Link>
            </Box>


        </Container>
    )
}

export default Login