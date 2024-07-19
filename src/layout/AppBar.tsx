import {
  Box,
  Collapse,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  useMediaQuery,
} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';

import { Link, useLocation } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';

import React, { useState } from 'react';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import BugIcon from '../assets/icons/bug.svg';
import CityIcon from '../assets/icons/city.svg';
import CommunityIcon from '../assets/icons/community.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import TeamsIcon from '../assets/icons/teams.svg';
import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { drawerWidth } from '../constants';
import { Button } from '../themed/button/Button';
import { Text } from '../themed/text/Text';

export interface AppBarProps {
  auth?: boolean;
  signUp?: boolean;
  logout?: () => void | undefined;
}

export function AppBar({ auth = false, signUp = false, logout }: AppBarProps) {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const matches = useMediaQuery('(min-width:600px)');

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const [searchText, setSearchText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box sx={{ paddingLeft: { xs: 2, sm: 0 } }}>
      <Toolbar className="ml-4" disableGutters sx={{ height: '80px' }}>
        <div className="flex flex-1 flex-col align-middle justify-center">
          <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
            <img className={!matches ? 'right-4' : ''} src={Logo} alt="logo" />
          </Link>
        </div>
      </Toolbar>

      <List
        aria-labelledby="nested-list-subheader"
        subheader={
          <Box className="w-full px-4 py-2">
            <TextField
              size="small"
              label={t(`menu.search`)}
              variant="outlined"
              value={searchText}
              onChange={handleTextChange}
            />
          </Box>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <img src={CityIcon} alt="city-icon" />
          </ListItemIcon>
          <ListItemText primary={<Text type="menuItem">{t('menu.myCity')}</Text>} />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <img src={CommunityIcon} alt="community-icon" />
          </ListItemIcon>
          <ListItemText primary={<Text type="menuItem">{t('menu.myCommunity')}</Text>} />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <img src={TeamsIcon} alt="teams-icon" />
          </ListItemIcon>
          <ListItemText primary={<Text type="menuItem">{t('menu.teams')}</Text>} />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <img src={BugIcon} alt="breedingSites-icon" />
          </ListItemIcon>
          <ListItemText primary={<Text type="menuItem">{t('menu.breedingSites')}</Text>} />
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <img src={SettingsIcon} alt="settings-icon" />
          </ListItemIcon>
          <ListItemText primary={<Text type="menuItem">{t('menu.settings')}</Text>} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/users">
              <ListItemText primary={<Text type="menuItem">{t('menu.users')}</Text>} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/roles">
              <ListItemText primary={<Text type="menuItem">{t('menu.roles')}</Text>} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/organizations">
              <ListItemText primary={<Text type="menuItem">{t('menu.organizations')}</Text>} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  if (!auth) {
    return (
      <MuiAppBar position="static" className="bg-white border-solid border-b border-neutral mb-4" elevation={0}>
        <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
          <Toolbar disableGutters sx={{ height: '80px' }}>
            <div className="flex flex-1 flex-col align-middle justify-center">
              <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                <img className={!matches ? 'right-4' : ''} src={Logo} alt="logo" />
              </Link>
            </div>

            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
              {auth && !!logout && (
                <Button className="mr-4" size="small" label={t('logout')} onClick={() => logout()} />
              )}
              {!auth && location.pathname !== '/login' && (
                <Button primary={false} className="mr-4" size="small" label={t('login')} component={Link} to="/login" />
              )}
              {signUp && !auth && (
                <Button className="mr-4" size="small" label={t('register')} component={Link} to="/register" />
              )}

              <SelectLanguageComponent />
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    );
  }

  return (
    <>
      <MuiAppBar
        // position="static"
        className="bg-white border-solid border-b border-neutral mb-4"
        elevation={0}
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
          <Toolbar disableGutters sx={{ height: '80px' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon color="primary" />
            </IconButton>

            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
              {auth && !!logout && (
                <Button className="mr-4" size="small" label={t('logout')} onClick={() => logout()} />
              )}
              {!auth && location.pathname !== '/login' && (
                <Button primary={false} className="mr-4" size="small" label={t('login')} component={Link} to="/login" />
              )}
              {signUp && !auth && (
                <Button className="mr-4" size="small" label={t('register')} component={Link} to="/register" />
              )}

              <SelectLanguageComponent />
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="drawer menu">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}

export default AppBar;
