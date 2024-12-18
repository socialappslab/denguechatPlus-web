import { Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import asuncion from '@/assets/images/asuncion.png';
import comunidad from '@/assets/images/comunidad.png';
import datos from '@/assets/images/datos.png';
import iquitos from '@/assets/images/iquitos.png';
import managua from '@/assets/images/managua.png';
import splash1 from '@/assets/images/splash-1.png';
import Icon from '@/components/icon';
import { COLORS } from '@/constants';
import { Button } from '@/themed/button/Button';
import Text from '@/themed/text/Text';
import { Title } from '@/themed/title/Title';

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
              <Button
                outlined
                primary={false}
                variant="outlined"
                className="mr-4"
                buttonType="small"
                label={t('cta.whatIs')}
                to=""
              />
              <Button className="mr-4" buttonType="small" label={t('cta.register')} component={Link} to="/register" />
            </Box>
          </Box>
          <Box className="flex col-span-3">
            <img src={splash1} alt="" className="rounded-xl" />
          </Box>
        </Box>

        {/* Participants */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl mt-10">
          <Icon type="Hello" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-4 align-center" label={t('participants.knowParticipants')} />
          <Text className="flex-row">{t('participants.actorsInvolved')}</Text>
          <Box className="mt-10">
            <iframe
              title="video"
              width="900"
              height="480"
              src="https://www.youtube.com/embed/hwod5NOxiNM"
              allow="encrypted-media"
              allowFullScreen
              className="rounded-xl border-none"
            />
          </Box>
          <Button
            buttonType="small"
            label={t('cta.watchMore')}
            href="https://www.youtube.com/@denguechat4442/videos"
            className="mt-10"
            target="_blank"
          />
        </Box>

        {/* Cities */}
        <Box className="flex flex-col items-center justify-center mt-20 mb-20 bg-gray-300">
          <Icon type="City" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-12 align-center" label={t('cities.citiesWithDengueChat')} />

          {/* Columns */}
          <Box className="grid grid-cols-3 gap-5">
            <Box>
              <img className="rounded-xl max-w-full" src={iquitos} alt="" />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.denguechat.org/"
                className="flex items-center justify-between no-underline decoration-black visited:text-black"
              >
                <p className="font-bold">Iquitos, Perú</p>
                <Icon type="Export" className="stroke-black" />
              </a>
            </Box>
            <Box>
              <img className="rounded-xl max-w-full" src={managua} alt="" />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.denguechat.org/cities/4"
                className="flex items-center justify-between no-underline decoration-black visited:text-black"
              >
                <p className="font-bold">Managua, Nicaragua</p>
                <Icon type="Export" className="stroke-black" />
              </a>
            </Box>
            <Box>
              <img className="rounded-xl max-w-full" src={asuncion} alt="" />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.denguechat.org/cities/9"
                className="flex items-center justify-between no-underline decoration-black visited:text-black"
              >
                <p className="font-bold">Asunción, Paraguay</p>
                <Icon type="Export" className="stroke-black" />
              </a>
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

        {/* Register */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl mt-12">
          <Icon type="Register" className="fill-green-600 bg-green-100 box-content rounded-full p-3" />
          <Title type="page" className="flex-row mt-4 mb-5 align-center" label={t('register.platformRegister')} />

          <Text className="flex-row">{t('register.joinCommunity')}</Text>

          {/* Buttons */}
          <Box className="mt-8 ">
            <Button
              primary={false}
              variant="outlined"
              className="mr-4"
              buttonType="small"
              label={t('cta.learnMore')}
              to=""
            />
            <Button className="mr-4" buttonType="small" component={Link} label={t('cta.register')} to="/register" />
          </Box>
        </Box>

        {/* </Center> */}
      </Box>
    </Box>
  );
}
export default Splash;
