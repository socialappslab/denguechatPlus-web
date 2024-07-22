import { Link } from 'react-router-dom';
import { Box, Chip, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import asuncion from '@/assets/images/asuncion.png';
import comunidad from '@/assets/images/comunidad.png';
import datos from '@/assets/images/datos.png';
import iquitos from '@/assets/images/iquitos.png';
import managua from '@/assets/images/managua.png';
import splash1 from '@/assets/images/splash-1.png';
import splash2 from '@/assets/images/splash-2.png';
import Icon from '@/components/icon';
import { COLORS } from '@/constants';
import { Button } from '@/themed/button/Button';
import Text from '@/themed/text/Text';
import { Title } from '@/themed/title/Title';
import Logo from '../assets/images/logo.svg';

function Splash() {
  const { t } = useTranslation('splash');

  return (
    // Add a flex container and an inner container with max 1280px
    // <Center>
    <Box className="flex justify-center">
      <Box className="max-w-screen-xl">
        {/* Main */}
        <Box className="grid grid-cols-5 gap-10 mb-20">
          <Box className="flex flex-col col-span-2 justify-center items-start">
            <Chip className="text-sm border-solid rounded-lg mb-7" label={t('main.joinTeam')} variant="outlined" />
            <Title type="page" className="flex-row mb-4" label={t('main.dengueChatPlus')} />
            <Text className="flex-row mb-10">{t('main.citizensCopy')}</Text>

            {/* Buttons */}
            <Box>
              <Button primary={false} className="mr-4" size="small" label={t('main.cta.learnMore')} to="" />
              <Button className="mr-4" size="small" label={t('main.cta.register')} to="/register" />
            </Box>
          </Box>
          <Box className="flex col-span-3">
            <img src={splash1} alt="" className="rounded-xl" />
          </Box>
        </Box>

        {/* Participants */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl">
          <Icon type="Hello" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-4 align-center" label="Conoce a los participantes" />
          <Text className="flex-row">Ve a los actores involucrados en la comunidad de Managua, Nicaragua</Text>
          <img src={splash2} alt="" />
          <Button size="small" label="Ver más videos" to="/register" />
        </Box>

        {/* Cities */}
        <Box className="flex flex-col items-center justify-center mt-20 bg-gray-300">
          <Icon type="City" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-4 align-center" label="Ciudades con DengueChat+" />
          <Text className="flex-row mb-10">Ciudades y sitios de experimentación piloto utilizando DengueChat</Text>

          {/* Columns */}
          <Box className="grid grid-cols-3 gap-5">
            <Box>
              <img className="rounded-xl max-w-full" src={iquitos} alt="" />
              <p className="font-bold">Iquitos, Perú</p>
            </Box>
            <Box>
              <img className="rounded-xl max-w-full" src={managua} alt="" />
              <p className="font-bold">Managua, Nicaragua</p>
            </Box>
            <Box>
              <img className="rounded-xl max-w-full" src={asuncion} alt="" />
              <p className="font-bold">Asunción, Paraguay</p>
            </Box>
          </Box>
        </Box>

        {/* Comunidad */}
        <Box className="grid grid-cols-2 py-20">
          <img src={comunidad} alt="" className="rounded-xl" />
          <Box>
            <Icon type="Community" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
            <Title type="page" className="flex-row mt-4 mb-4 align-center" label="Comunidad en DengueChat+" />
            <Text className="mb-10">
              DengueChat+ involucra a las comunidades en la lucha contra Dengue, Zika y Chikungunya
            </Text>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>Chatea con otros miembros de la comunidad para reportar y controlar criaderos de mosquitos</Text>
            </Box>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>Únete a equipos para combatir Dengue, Zika y Chikungunya y gane puntos</Text>
            </Box>
          </Box>
        </Box>

        {/* Datos */}
        <Box className="grid grid-cols-2 py-20">
          <Box>
            <Icon type="Data" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
            <Title type="page" className="flex-row mt-4 mb-4 align-center" label="Comunidad en DengueChat+" />
            <Text className="mb-10">
              DengueChat+ involucra a las comunidades en la lucha contra Dengue, Zika y Chikungunya
            </Text>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>Chatea con otros miembros de la comunidad para reportar y controlar criaderos de mosquitos</Text>
            </Box>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>Únete a equipos para combatir Dengue, Zika y Chikungunya y gane puntos</Text>
            </Box>
          </Box>
          <img src={datos} alt="" className="rounded-xl justify-self-end" />
        </Box>

        {/* Registrate */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl">
          <Icon type="Data" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-5 align-center" label="Regístrate en la plataforma" />
          <Text className="flex-row">Únete a tu comunidad y lucha contra el mosquito del Aedes aegypti.</Text>

          {/* Buttons */}
          <Box className="mt-8">
            <Button primary={false} className="mr-4" size="small" label={t('main.cta.learnMore')} to="" />
            <Button className="mr-4" size="small" label={t('main.cta.register')} to="/register" />
          </Box>
        </Box>

        {/* </Footer> */}
        <Box className="mt-8 ">
          <Toolbar disableGutters sx={{ height: '80px' }} className="flex justify-between">
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <img src={Logo} alt="logo" />
            </Link>
            <Box sx={{ display: 'flex' }}>
              <Button primary={false} className="mr-4" size="small" label="Guía de usuario" component={Link} to="/" />
              <Button primary={false} className="mr-4" size="small" label="Sobre DengueChat+" component={Link} to="/" />
              <Button primary={false} className="mr-4" size="small" label="El Zancudo" component={Link} to="/" />
              <Button
                primary={false}
                className="mr-4"
                size="small"
                label="Preguntas Frecuentes"
                component={Link}
                to="/"
              />
            </Box>
            <Box>
              <Text type="menuItem">© 2024</Text>
            </Box>
          </Toolbar>
        </Box>
      </Box>
    </Box>
  );
}
export default Splash;
