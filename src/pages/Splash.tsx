import { Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
import googlePlayBadgeEN from '@/assets/images/GetItOnGooglePlay_Badge_Web_color_English.png';
import googlePlayBadgeES from '@/assets/images/GetItOnGooglePlay_Badge_Web_color_Spanish-LATAM.png';
import googlePlayBadgePT from '@/assets/images/GetItOnGooglePlay_Badge_Web_color_Portuguese-BR.png';
import appStoreBadgeEN from '@/assets/images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg';
import appStoreBadgeES from '@/assets/images/Download_on_the_App_Store_Badge_ES_RGB_blk_100217.svg';
import appStoreBadgePT from '@/assets/images/Download_on_the_App_Store_Badge_PTBR_RGB_blk_092917.svg';

function Splash() {
  const { t, i18n } = useTranslation('splash');

  const googlePlayBadge = useMemo(() => {
    switch (i18n.language) {
      case 'en':
        return googlePlayBadgeEN;
      case 'es':
        return googlePlayBadgeES;
      case 'pt':
        return googlePlayBadgePT;
      default:
        return googlePlayBadgeEN;
    }
  }, [i18n.language]);

  const appStoreBadge = useMemo(() => {
    switch (i18n.language) {
      case 'en':
        return appStoreBadgeEN;
      case 'es':
        return appStoreBadgeES;
      case 'pt':
        return appStoreBadgePT;
      default:
        return appStoreBadgeEN;
    }
  }, [i18n.language]);

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

            <Box className="flex gap-4 mt-4">
              <Link to="https://play.google.com/store/apps/details?id=org.denguechatplus" target="_blank">
                <img src={googlePlayBadge} alt="Get it on Google Play" className="h-11" />
              </Link>
              <Link to="https://apps.apple.com/py/app/denguechatplus/id6741427309" target="_blank">
                <img src={appStoreBadge} alt="Download on the App Store" className="h-11" />
              </Link>
            </Box>
          </Box>
          <Box className="flex col-span-3">
            <img src={splash1} alt="" className="rounded-xl" />
          </Box>
        </Box>

        {/* User Guide */}
        <Box className="flex flex-col items-center justify-center py-16 bg-neutral-50 rounded-2xl mt-12">
          <InfoOutlinedIcon className="fill-green-600 bg-green-100 box-content rounded-full p-3" />

          <Title type="page" className="flex-row mt-4 mb-5 align-center" label={t('userGuide.title')} />

          <Text className="flex-row">{t('userGuide.description')}</Text>

          <Box className="mt-8 ">
            <Button
              component={Link}
              primary={false}
              variant="outlined"
              className="mr-4"
              buttonType="small"
              label={t('userGuide.button')}
              to="https://scribehow.com/page/Guia_de_Usuario__Id5Pqg7PTqeXHAqDhYyRWw"
              target="_blank"
            />
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
