import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import isAuthorised from '../../../utils/isAuthorised';
import LoadingPage from '../loading/page';
function NavbarComponent() {
    const [anchorel, setAnchorel] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const verify = isAuthorised();
            if (!verify) {
                router.push("/");
            }
            else {
                setLoading(false);
            }
        })();
    }, [])
    if (loading) {
        return <LoadingPage />
    }
    const handleOpen = (event) => {
        setAnchorel(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorel(null);
    }

    return (
        <AppBar>
            <Toolbar>

                <Typography
                    variant='h5' fontWeight={600} color="inherit"
                    sx={{ display: { xs: "none", md: "flex", marginRight: '15px' }, mr: 2 }}>
                    Todo!
                </Typography>

                {/* For Mobile */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton
                        onClick={handleOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorel}
                        open={Boolean(anchorel)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>About us</MenuItem>
                        <MenuItem onClick={handleClose}>Public Privacy</MenuItem>
                        <MenuItem onClick={handleClose}>My Profile</MenuItem>
                    </Menu>
                    {/* For DesktopL */}
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 'auto' }}>
                    <Button color="inherit">About us</Button>
                    <Button color="inherit">Public Privacy</Button>
                    <Button color="inherit">Profile</Button>
                </Box>


            </Toolbar>


        </AppBar>
    )
}

export default NavbarComponent