"use client";
import NavbarComponent from '@/component/navbar/page';
import React, { useEffect, useState } from 'react';
import isAuthorised from '../../../../utils/isAuthorised';
import { useRouter } from 'next/navigation';
import LoadingPage from '@/component/loading/page';
import { Box, Card, Typography, Avatar, Button, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [name, setName] = useState("User");
    const [email, setEmail] = useState("user@example.com");

    useEffect(() => {
        (async () => {
            const verify = await isAuthorised();
            if (!verify) {
                router.push('/');
            } else {
                setLoading(false);
            }
        })();
        // Get from localStorage after SSR hydration
        setName(localStorage.getItem("name") || "User");
        setEmail(localStorage.getItem("email") || "user@example.com");
    }, [router]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <Box 
        sx={{ background: 'linear-gradient(135deg, #e9f0ff 0%, #f6fcff 100%)'
        , minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        }}>
            <NavbarComponent />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 6,
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 5,
                        minWidth: { xs: 320, sm: 420 },
                        background: 'rgba(255,255,255,0.97)',
                        boxShadow: '0 6px 32px rgba(25, 118, 210, 0.09)',
                        mb: 4,
                        mt: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 84, height: 84, mb: 2, bgcolor: 'primary.main', boxShadow: 2 }}>
                            <PersonIcon sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight={700}>
                            {name}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '1.1rem', mt: 1 }}>
                            Welcome to your profile page 🎉
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                            {email}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                            You can view and edit your personal information here.
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
                            Edit Profile
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default ProfilePage;