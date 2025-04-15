import { Menu as MenuIcon } from '@mui/icons-material';
import { Box, Container, IconButton, Menu, MenuItem, Toolbar, useMediaQuery } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import React, { useState } from 'react';

import Logo from '../assets/images/logo.svg';
import SelectLanguageComponent from '../components/SelectLanguageComponent';
import { Button } from '../themed/button/Button';

export default function Header() {
  const { t } = useTranslation('translation');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const matches = useMediaQuery('(min-width:600px)');

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <MuiAppBar position="static" className="bg-white border-solid border-neutral-100 mb-4" elevation={0}>
      <Container maxWidth={false} className="lg:px-20 md:px-12 sm:px-10 px-6 mx-0">
        <Toolbar disableGutters sx={{ height: '80px', display: 'flex', justifyContent: 'space-between' }}>
          <Box className="flex items-center gap-4">
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <img className={!matches ? 'right-4' : ''} src={Logo} alt="logo" />
            </Link>
            <Button
              primary={false}
              buttonType="small"
              label="Tariki - Iquitos"
              component={Link}
              to="https://www.tariki.org/"
              target="_blank"
              sx={{ display: { xs: 'none', md: 'block' } }}
            />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'flex-end' }}>
            {pathname !== '/login' && (
              <Button
                primary={false}
                className="mr-4"
                buttonType="small"
                label={t('login')}
                component={Link}
                to="/login"
              />
            )}
            {pathname !== '/register' && (
              <Button className="mr-4" buttonType="small" label={t('register')} component={Link} to="/register" />
            )}

            <SelectLanguageComponent />
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="mobile menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem component={Link} to="https://www.tariki.org/" target="_blank" onClick={handleCloseNavMenu}>
                Tariki - Iquitos
              </MenuItem>
              {pathname !== '/login' && (
                <MenuItem
                  onClick={() => {
                    navigate('/login');
                    handleCloseNavMenu();
                  }}
                >
                  {t('login')}
                </MenuItem>
              )}
              {pathname !== '/register' && (
                <MenuItem
                  onClick={() => {
                    navigate('/register');
                    handleCloseNavMenu();
                  }}
                >
                  {t('register')}
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
