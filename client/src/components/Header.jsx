import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Centralized navigation configuration
  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon />, show: true },
    { label: 'About', path: '/about', icon: <InfoIcon />, show: true },
    { label: 'Goals', path: '/goals', icon: <AssignmentIcon />, show: Boolean(user) },
  ].filter((item) => item.show);

  const authLinks = user
    ? [{ label: 'Log out', action: handleLogout, icon: <LogoutIcon />, color: 'inherit' }]
    : [
        { label: 'Login', path: '/login', icon: <LoginIcon />, show: true },
        { label: 'Register', path: '/register', icon: <PersonAddIcon />, show: true },
      ];

  return (
    <AppBar position="sticky" elevation={3} sx={{ backgroundColor: '#bc6c25' }}>
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' }, px: { xs: 2, sm: 3 } }}>
        
        {/* Brand / Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            textDecoration: 'none',
            color: 'inherit',
            mr: 3,
            '&:hover': { opacity: 0.9 },
          }}
        >
          <AssignmentIcon fontSize="large" />
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            Goals Tracker
          </Typography>
        </Box>

        {/* Mobile Navigation Trigger */}
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open navigation menu"
              onClick={toggleDrawer(true)}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    width: { xs: '75%', sm: '320px' },
                    backgroundColor: '#fefae0',
                    color: '#283618',
                    display: 'flex',
                    flexDirection: 'column',
                  },
                },
              }}
            >
              {/* Drawer Header */}
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#dda15e',
                  color: '#fff',
                }}
              >
                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                    <Avatar sx={{ bgcolor: '#bc6c25', width: 36, height: 36 }}>
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="subtitle1" fontWeight={600}>
                    Menu
                  </Typography>
                )}
                <IconButton onClick={toggleDrawer(false)} size="small" sx={{ color: '#fff' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider />

              {/* Drawer Navigation List */}
              <List sx={{ px: 1, py: 2 }}>
                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={toggleDrawer(false)}
                        selected={isActive}
                        sx={{
                          borderRadius: 2,
                          '&.Mui-selected': {
                            backgroundColor: '#dda15e',
                            color: '#fff',
                            '& .MuiListItemIcon-root': { color: '#fff' },
                            '&:hover': { backgroundColor: '#bc6c25' },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}

                <Divider sx={{ my: 1.5 }} />

                {authLinks.map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={item.path ? Link : 'button'}
                      to={item.path}
                      onClick={(e) => {
                        toggleDrawer(false)(e);
                        if (item.action) item.action();
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </>
        ) : (
          /* Desktop Navigation */
          <Box display="flex" alignItems="center" gap={1} sx={{ ml: 'auto' }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    px: 1.5,
                    fontWeight: isActive ? 700 : 500,
                    borderBottom: isActive ? '2px solid #fefae0' : '2px solid transparent',
                    borderRadius: 0,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1.5 }}>
              {user ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#dda15e', fontSize: '0.875rem' }}>
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        maxWidth: 180,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'none',
                      '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    variant="contained"
                    sx={{
                      backgroundColor: '#dda15e',
                      color: '#283618',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#fefae0' },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;