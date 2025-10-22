import { Box, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { Link as LinkIcon, FactCheckOutlined as FactCheckOutlinedIcon } from '@mui/icons-material';
import { Link as RouterLink, Location, useLocation } from 'react-router-dom';
import Title from '@/themed/title/Title';
import { useTranslation } from 'react-i18next';

export default function UploadVisitsSuccessPage() {
  interface VisitSummary {
    id: number;
    houseName: string;
    containerCount: number;
  }

  const location: Location<{ visitSummaries: VisitSummary[] }> = useLocation();
  const { visitSummaries } = location.state;
  const { t } = useTranslation('translation');
  return (
    <Box>
      <Title type="page2" label={t('uploadVisits.success.title')} />
      <Typography>{t('uploadVisits.success.description', { count: visitSummaries.length })}</Typography>

      <Stack sx={{ marginTop: 2 }}>
        {visitSummaries.map((visit) => (
          <ListItemButton key={visit.id} component={RouterLink} to={`/visits/${visit.id}/edit`} target="_blank">
            <ListItemIcon>
              <FactCheckOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary={t('uploadVisits.success.itemPrimary', { id: visit.id, houseName: visit.houseName })}
              secondary={t('uploadVisits.success.itemSecondary', { count: visit.containerCount })}
            />
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </Stack>
    </Box>
  );
}
