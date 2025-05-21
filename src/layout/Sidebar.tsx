import Icon from '@/components/icon';
import { drawerWidth } from '@/constants';
import {
  CITIES_INDEX,
  HOUSE_BLOCKS_INDEX,
  ORGANIZATIONS_INDEX,
  REPORTS_INDEX,
  ROLES_INDEX,
  SPECIAL_PLACES_INDEX,
  TEAMS_INDEX,
  USERS_INDEX,
  VISITS_INDEX,
} from '@/constants/permissions';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
} from '@mui/material';
import { matches } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { version } from '../../package.json';
import ReportsIcon from '../assets/icons/reports.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { Button } from '../themed/button/Button';
import { Text } from '../themed/text/Text';
import ProtectedView from './ProtectedView';

// routes
const ADMIN_USERS = '/admin/users';
const ADMIN_SITES = '/reports/sites';
const ADMIN_HEATMAP = '/reports/heat-map';
const ADMIN_VISITS_FULL_REPORT = '/reports/visits-detailed';
const ADMIN_VISITS = '/reports/visits';
const ADMIN_ROLES = '/admin/roles';
const ADMIN_ORGANIZATIONS = '/admin/organizations';
const ADMIN_CITIES = '/admin/cities';
const ADMIN_SPECIAL_PLACES = '/admin/special-places';
const ADMIN_TEAMS = '/admin/teams';
const ADMIN_HOUSE_BLOCKS = '/admin/house-blocks';

const MY_CITY = '/my-city';
const MY_COMMUNITY = '/my-community';
const VISITS = '/visits';

export default function Sidebar({ logout }: { logout: () => void }) {
  const { t } = useTranslation('translation');
  const { pathname } = useLocation();

  const [searchText, setSearchText] = useState('');
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    settingsMenu: false,
    reportsMenu: false,
  });

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const genericHandleClick = (menuId: string) => {
    setOpenMenus((prev) => {
      const isOpen = prev[menuId];
      return {
        ...prev,
        [menuId]: !isOpen,
      };
    });
  };

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="drawer menu">
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Box sx={{ paddingLeft: { xs: 2, sm: 0 } }} className="flex flex-col justify-between min-h-full">
          <Box>
            <Toolbar className="ml-4" disableGutters sx={{ height: '80px' }}>
              <div className="flex flex-row items-center space-x-4">
                <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                  <img className={!matches ? 'right-4' : ''} src={Logo} alt="logo" />
                </Link>
                <Text type="menuItem" className="text-neutral-300">
                  v{version}
                </Text>
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

              <ProtectedView hasPermission={[VISITS_INDEX]}>
                <ListItemButton component={Link} to={VISITS} selected={pathname.includes(VISITS)}>
                  <ListItemIcon>
                    <Icon type="FactCheck" />
                  </ListItemIcon>
                  <ListItemText primary={<Text type="menuItem">{t('menu.visits')}</Text>} />
                </ListItemButton>
              </ProtectedView>
              <ProtectedView hasPermission={[REPORTS_INDEX]}>
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
                    <ProtectedView hasPermission={[USERS_INDEX]}>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to={ADMIN_VISITS_FULL_REPORT}
                        selected={pathname.includes(ADMIN_VISITS_FULL_REPORT)}
                      >
                        <ListItemText primary={<Text type="menuItem">{t('menu.reports.visits_full')}</Text>} />
                      </ListItemButton>
                    </ProtectedView>
                  </List>
                </Collapse>
              </ProtectedView>
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
                    <ProtectedView hasPermission={[HOUSE_BLOCKS_INDEX]}>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        component={Link}
                        to={ADMIN_HOUSE_BLOCKS}
                        selected={pathname.includes(ADMIN_HOUSE_BLOCKS)}
                      >
                        <ListItemText primary={<Text type="menuItem">{t('menu.house_blocks')}</Text>} />
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
              {!!logout && (
                <Button className="mr-4 min-w-full" buttonType="small" label={t('logout')} onClick={() => logout()} />
              )}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
