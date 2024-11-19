import {
  Box,
  Collapse,
  Container,
  Drawer,
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

import React, { useState } from 'react';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Icon from '@/components/icon';
import {
  CITIES_INDEX,
  ORGANIZATIONS_INDEX,
  ROLES_INDEX,
  SPECIAL_PLACES_INDEX,
  TEAMS_INDEX,
  USERS_INDEX,
} from '@/constants/permissions';
import BugIcon from '../assets/icons/bug.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import ReportsIcon from '../assets/icons/reports.svg';
import TeamsIcon from '../assets/icons/teams.svg';
import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { drawerWidth } from '../constants';
import { Button } from '../themed/button/Button';
import { Text } from '../themed/text/Text';
import ProtectedView from './ProtectedView';

export interface AppBarProps {
  auth?: boolean;
  signUp?: boolean;
  logout?: () => void | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  footer?: boolean;
}

// routes
const ADMIN_USERS = '/admin/users';
const ADMIN_SITES = '/sites';
const ADMIN_HEATMAP = '/heat-map';
const ADMIN_VISITS = '/visits';
const ADMIN_ROLES = '/admin/roles';
const ADMIN_ORGANIZATIONS = '/admin/organizations';
const ADMIN_CITIES = '/admin/cities';
const ADMIN_SPECIAL_PLACES = '/admin/special-places';
const ADMIN_TEAMS = '/admin/teams';

const MY_CITY = '/my-city';
const MY_COMMUNITY = '/my-community';

export function AppBar({ auth = false, signUp = false, logout }: AppBarProps) {
  const { t } = useTranslation('translation');
  const location = useLocation();
  const { pathname } = location;
  const matches = useMediaQuery('(min-width:600px)');

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  // const handleDrawerToggle = () => {
  //   if (!isClosing) {
  //     setMobileOpen(!mobileOpen);
  //   }
  // };

  const [searchText, setSearchText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>({
    settingsMenu: false,
    reportsMenu: false,
  });

  const genericHandleClick = (menuId: string) => {
    setOpenMenus((prev) => {
      const isOpen = prev[menuId];
      return {
        ...prev,
        [menuId]: !isOpen,
      };
    });
  };

  const drawer = (
    <Box sx={{ paddingLeft: { xs: 2, sm: 0 } }} className="flex flex-col justify-between min-h-full">
      <Box>
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
            <Box className="min-w-full px-4 py-2 mb-4">
              <TextField
                size="small"
                label={t(`menu.search`)}
                variant="outlined"
                value={searchText}
                onChange={handleTextChange}
                className="min-w-full"
              />
            </Box>
          }
        >
          <ListItemButton component={Link} to={MY_CITY} selected={pathname.includes(MY_CITY)}>
            <ListItemIcon>
              <Icon type="City" />
            </ListItemIcon>
            <ListItemText primary={<Text type="menuItem">{t('menu.myCity')}</Text>} />
          </ListItemButton>
          <ListItemButton component={Link} to={MY_COMMUNITY} selected={pathname.includes(MY_COMMUNITY)}>
            <ListItemIcon>
              <Icon type="Community" />
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
          <ProtectedView
            hasSomePermission={[ROLES_INDEX, ORGANIZATIONS_INDEX, USERS_INDEX, CITIES_INDEX, SPECIAL_PLACES_INDEX]}
          >
            <ListItemButton onClick={() => genericHandleClick('settingsMenu')}>
              <ListItemIcon>
                <img src={SettingsIcon} alt="settings-icon" />
              </ListItemIcon>
              <ListItemText primary={<Text type="menuItem">{t('menu.settings')}</Text>} />
              {openMenus.settingsMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenus.settingsMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ProtectedView hasPermission={[USERS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_USERS}
                    selected={pathname.includes(ADMIN_USERS)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.users')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[ROLES_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_ROLES}
                    selected={pathname.includes(ADMIN_ROLES)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.roles')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[ORGANIZATIONS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_ORGANIZATIONS}
                    selected={pathname.includes(ADMIN_ORGANIZATIONS)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.organizations')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[CITIES_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_CITIES}
                    selected={pathname.includes(ADMIN_CITIES)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.cities')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[SPECIAL_PLACES_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_SPECIAL_PLACES}
                    selected={pathname.includes(ADMIN_SPECIAL_PLACES)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.specialPlaces')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[TEAMS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_TEAMS}
                    selected={pathname.includes(ADMIN_TEAMS)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.teams')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
              </List>
            </Collapse>
          </ProtectedView>
          <ProtectedView
            hasSomePermission={[ROLES_INDEX, ORGANIZATIONS_INDEX, USERS_INDEX, CITIES_INDEX, SPECIAL_PLACES_INDEX]}
          >
            <ListItemButton onClick={() => genericHandleClick('reportsMenu')}>
              <ListItemIcon>
                <img src={ReportsIcon} alt="reports-icon" />
              </ListItemIcon>
              <ListItemText primary={<Text type="menuItem">{t('menu.reports.name')}</Text>} />
              {openMenus.reportsMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMenus.reportsMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ProtectedView hasPermission={[USERS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_SITES}
                    selected={pathname.includes(ADMIN_SITES)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.reports.sites')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[USERS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_HEATMAP}
                    selected={pathname.includes(ADMIN_HEATMAP)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.reports.heatMap')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
                <ProtectedView hasPermission={[USERS_INDEX]}>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={ADMIN_VISITS}
                    selected={pathname.includes(ADMIN_VISITS)}
                  >
                    <ListItemText primary={<Text type="menuItem">{t('menu.reports.visits')}</Text>} />
                  </ListItemButton>
                </ProtectedView>
              </List>
            </Collapse>
          </ProtectedView>
        </List>
      </Box>
      <Box>
        <Box className="px-4 min-w-full">
          <SelectLanguageComponent className="min-w-full" />
        </Box>

        <Box className="px-4 mb-4 mt-4 min-w-full">
          {auth && !!logout && (
            <Button className="mr-4 min-w-full" buttonType="small" label={t('logout')} onClick={() => logout()} />
          )}
          {!auth && location.pathname !== '/login' && (
            <Button
              primary={false}
              className="mr-4"
              buttonType="large"
              label={t('login')}
              component={Link}
              to="/login"
            />
          )}
          {signUp && !auth && (
            <Button className="mr-4" buttonType="small" label={t('register')} component={Link} to="/register" />
          )}
        </Box>
      </Box>
    </Box>
  );

  if (!auth) {
    return (
      <MuiAppBar position="static" className="bg-white border-solid border-neutral-100 mb-4" elevation={0}>
        <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
          <Toolbar disableGutters sx={{ height: '80px' }}>
            <div className="flex flex-1 flex-col align-middle justify-center">
              <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                <img className={!matches ? 'right-4' : ''} src={Logo} alt="logo" />
              </Link>
            </div>

            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
              {auth && !!logout && (
                <Button className="mr-4" buttonType="small" label={t('logout')} onClick={() => logout()} />
              )}
              {!auth && location.pathname !== '/login' && (
                <Button
                  primary={false}
                  className="mr-4"
                  buttonType="small"
                  label={t('login')}
                  component={Link}
                  to="/login"
                />
              )}
              {signUp && !auth && (
                <Button className="mr-4" buttonType="small" label={t('register')} component={Link} to="/register" />
              )}

              <SelectLanguageComponent />
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    );
  }

  return (
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
  );
}

export default AppBar;
