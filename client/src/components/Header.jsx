import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import Box from '@mui/material/Box';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logoutHandler = () => {
    try {
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = (
    <>
      <ListItem button component={Link} to="/">
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/about">
        <ListItemIcon><InfoIcon /></ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
      {user && (
        <ListItem button component={Link} to="/goals">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Goals" />
        </ListItem>
      )}
      {user ? (
        <ListItem button onClick={logoutHandler}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Log out" />
        </ListItem>
      ) : (
        <>
          <ListItem button component={Link} to="/login">
            <ListItemIcon><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register">
            <ListItemIcon><PersonAddIcon /></ListItemIcon>
            <ListItemText primary="Register" />
          </ListItem>
        </>
      )}
    </>
  );

  return (
    <AppBar position="static" elevation={4}>
      <Toolbar style={{ backgroundColor: '#bc6c25', minHeight: '70px' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AssignmentIcon fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Goals Tracker
          </Typography>
        </Box>
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              style={{ marginLeft: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{ style: { width: '60%', backgroundColor: '#fefae0' } }}
            >
              <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                {menuItems}
              </List>
            </Drawer>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={1} marginLeft="auto">
            {user && (
              <Typography variant="body1" sx={{ marginRight: 2, fontWeight: 500 }}>
                Welcome, {user.email}
              </Typography>
            )}
            <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>Home</Button>
            <Button color="inherit" component={Link} to="/about" startIcon={<InfoIcon />}>About</Button>
            {user && <Button color="inherit" component={Link} to="/goals" startIcon={<AssignmentIcon />}>Goals</Button>}
            {user ? (
              <Button color="inherit" onClick={logoutHandler} startIcon={<LogoutIcon />}>Log out</Button>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>Login</Button>
                <Button color="inherit" component={Link} to="/register" startIcon={<PersonAddIcon />}>Register</Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;