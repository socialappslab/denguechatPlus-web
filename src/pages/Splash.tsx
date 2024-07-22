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
              <Button primary={false} className="mr-4" buttonType="small" label={t('cta.learnMore')} to="" />
              <Button className="mr-4" buttonType="small" label={t('cta.register')} to="/register" />
            </Box>
          </Box>
          <Box className="flex col-span-3">
            <img src={splash1} alt="" className="rounded-xl" />
          </Box>
        </Box>

        {/* Participants */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl">
          <Icon type="Hello" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-4 align-center" label={t('participants.knowParticipants')} />
          <Text className="flex-row">{t('participants.actorsInvolved')}</Text>
          <img src={splash2} alt="" />
          <Button buttonType="small" label={t('cta.watchMore')} to="/" />
        </Box>

        {/* Cities */}
        <Box className="flex flex-col items-center justify-center mt-20 bg-gray-300">
          <Icon type="City" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-4 align-center" label={t('cities.citiesWithDengueChat')} />
          <Text className="flex-row mb-10">{t('cities.pilotSpots')}</Text>

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
            <Title type="page" className="flex-row mt-4 mb-4 align-center" label={t('community.dengueChatCommunity')} />
            <Text className="mb-10">{t('community.communityInvolvement')}</Text>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>{t('community.chatWithMembers')}</Text>
            </Box>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>{t('community.joinTeams')}</Text>
            </Box>
          </Box>
        </Box>

        {/* Datos */}
        <Box className="grid grid-cols-2 py-20">
          <Box>
            <Icon type="Data" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
            <Title type="page" className="flex-row mt-4 mb-4 align-center" label={t('data.dengueChatData')} />
            <Text className="mb-10">{t('data.analyzeAndMeasure')}</Text>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>{t('data.versatileTools')}</Text>
            </Box>
            <Box className="flex">
              <Icon type="Verified" fill={COLORS.green[600]} className="mr-2 w-8 flex-none" />
              <Text>{t('data.generateReports')}</Text>
            </Box>
          </Box>
          <img src={datos} alt="" className="rounded-xl justify-self-end" />
        </Box>

        {/* Registrate */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl">
          <Icon type="Data" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-5 align-center" label={t('register.platformRegister')} />

          <Text className="flex-row">{t('register.joinCommunity')}</Text>

          {/* Buttons */}
          <Box className="mt-8">
            <Button primary={false} className="mr-4" buttonType="small" label={t('cta.learnMore')} to="" />
            <Button className="mr-4" buttonType="small" label={t('cta.register')} to="/register" />
          </Box>
        </Box>

        {/* </Footer> */}
        <Box className="mt-8 ">
          <Toolbar disableGutters sx={{ height: '80px' }} className="flex justify-between">
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <img src={Logo} alt="logo" />
            </Link>
            <Box sx={{ display: 'flex' }}>
              <Button
                primary={false}
                className="mr-4"
                buttonType="small"
                label="Guía de usuario"
                component={Link}
                to="/"
              />
              <Button
                primary={false}
                className="mr-4"
                buttonType="small"
                label="Sobre DengueChat+"
                component={Link}
                to="/"
              />
              <Button primary={false} className="mr-4" buttonType="small" label="El Zancudo" component={Link} to="/" />
              <Button
                primary={false}
                className="mr-4"
                buttonType="small"
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
