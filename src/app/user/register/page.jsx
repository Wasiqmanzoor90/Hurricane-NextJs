'use client'

import { Box, Button, Container, TextField, Typography } from '@mui/material'
import Link from 'next/link'
// // import { useRouter } from "next/router";  // page router
import { useRouter } from "next/navigation"; // new one
import React, { useState } from 'react'


function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const formData = { username, email, password };

    const router = useRouter();

    const handleregister = async (e) => {

        e.preventDefault();
        try {
            const url = "/api/user/register";
           
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                
                setTimeout(() => {
                    router.push("/user/dashboard");
                  }, 2000); // ✅ correct
                  
            } else {
                console.log("Error:", data.message);
            }

        } catch (error) {
            console.log("Error during registration:", error);
        }
    }
    return (
        <Container style={{ width: '350px' }}>



            <Box
            component="form"
            onSubmit={handleregister}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid black',

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
                    name="username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <Button type='submit' variant='contained' sx={{ marginTop: '15px', borderRadius: '12px' }} fullWidth>
                Sign up
                </Button>

                <Link href='/' style={{ textDecoration: 'none',marginTop:'8px', padding:'5px'}}>
                Already have an account?

                </Link>


            </Box>


        </Container>
    )
}

export default Signup