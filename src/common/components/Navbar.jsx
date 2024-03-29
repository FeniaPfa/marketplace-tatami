import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useUserContext, useCartContext } from '../../context';
import logo from '/logo.svg';
import Icons from '../Icons';
import { AppBar, Badge, Button, Container, Divider, Drawer, Link, Stack, Toolbar, Typography } from '@mui/material';

export const Navbar = () => {
    const { user, logOut } = useUserContext();
    const { total } = useCartContext();

    const [open, setOpen] = useState(false);

    const routes = [
        { to: '/', text: 'Inicio', private: false },
        { to: '/products', text: 'Clases', private: false },
        { to: '/login', text: 'Ingresar', private: false, publicOnly: true },
        { to: '/register', text: 'Registrarse', private: false, publicOnly: true },
        { to: '/dashboard', text: 'Dashboard', private: true },
    ];

    const handleLogout = () => {
        logOut();
    };

    const linkStyle = {
        fontSize: '1.2rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textDecoration: 'none',
    };

    const activeStyle = {
        fontWeight: 'bold',
    };

    const activeLink = ({ isActive }) => (isActive ? activeStyle : { color: 'white' });
    const activeLinkMobile = ({ isActive }) => (isActive ? activeStyle : { color: '#455a64' });

    return (
        <AppBar position="sticky" component="nav" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Container maxWidth="lg">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Stack
                        direction="row"
                        sx={{
                            alignItems: 'center',
                            gap: '.8rem',
                            textDecoration: 'none',
                            color: '#fff',
                        }}
                        to="/"
                        component={RouterLink}>
                        <img src={logo} width="35px" alt="Logo Tatami" />
                        <Typography variant="h5" component="h1" fontWeight="bold" fontFamily="Kanit, sans-serif">
                            TATAMI
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        gap="1.2rem"
                        sx={{
                            '> a': { color: '#fff' },
                            alignItems: 'center',
                            display: { xs: 'none', md: 'inherit' },
                        }}>
                        {routes.map((item) => {
                            if (item.private && !user) return null;
                            if (item.publicOnly && user) return null;
                            return (
                                <React.Fragment key={item.text}>
                                    <Link
                                        className="nav-link"
                                        sx={linkStyle}
                                        variant="h5"
                                        style={activeLink}
                                        to={item.to}
                                        component={NavLink}>
                                        {item.text}
                                    </Link>
                                    <Divider orientation="vertical" variant="middle" flexItem />
                                </React.Fragment>
                            );
                        })}
                        {user && (
                            <>
                                <Link
                                    className="nav-link"
                                    sx={linkStyle}
                                    variant="h5"
                                    style={activeLink}
                                    to="/cart"
                                    component={NavLink}>
                                    Carrito
                                </Link>
                                <Link
                                    aria-label="Ver carrito"
                                    sx={linkStyle}
                                    variant="h5"
                                    style={activeLink}
                                    to="/cart"
                                    component={NavLink}>
                                    <Badge badgeContent={total.quantity} color="warning">
                                        <Icons.ShoppingCartIcon />
                                    </Badge>
                                </Link>
                                <Button variant="outlined" color="secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Stack>
                    <Button onClick={() => setOpen(!open)} variant="outlined" color="secondary" sx={{ display: { md: 'none' } }}>
                        <Icons.MenuIcon />
                    </Button>
                </Toolbar>
                <Drawer anchor="top" open={open}>
                    <Toolbar></Toolbar>
                    <Stack
                        mt="3rem"
                        gap="1.2rem"
                        sx={{
                            '> a': { color: '#455a64' },
                            alignItems: 'center',
                            display: { md: 'none' },
                        }}>
                        {routes.map((item) => {
                            if (item.private && !user) return null;
                            if (item.publicOnly && user) return null;
                            return (
                                <React.Fragment key={item.text}>
                                    <Link
                                        className="nav-link"
                                        sx={linkStyle}
                                        variant="h5"
                                        style={activeLinkMobile}
                                        to={item.to}
                                        onClick={() => setOpen(false)}
                                        component={NavLink}>
                                        {item.text}
                                    </Link>
                                    <Divider variant="middle" flexItem />
                                </React.Fragment>
                            );
                        })}
                        {user && (
                            <>
                                <Link
                                    className="nav-link"
                                    sx={linkStyle}
                                    variant="h5"
                                    style={activeLinkMobile}
                                    to="/cart"
                                    onClick={() => setOpen(false)}
                                    component={NavLink}>
                                    Carrito
                                </Link>
                                <Link
                                    aria-label="Ver carrito"
                                    sx={linkStyle}
                                    variant="h5"
                                    style={activeLinkMobile}
                                    to="/cart"
                                    onClick={() => setOpen(false)}
                                    component={NavLink}>
                                    <Badge badgeContent={total.quantity} color="primary">
                                        <Icons.ShoppingCartIcon />
                                    </Badge>
                                </Link>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleLogout}
                                    sx={{
                                        color: { xs: '#455a64', md: 'initial' },
                                        borderColor: { xs: '#455a64', md: 'initial' },
                                        marginBottom: { xs: '2rem', md: 'initial' },
                                    }}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </Stack>
                </Drawer>
            </Container>
        </AppBar>
    );
};
