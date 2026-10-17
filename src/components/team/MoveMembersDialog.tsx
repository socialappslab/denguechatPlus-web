import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { BrigadistOption } from './loadBrigadistOptions';

interface MoveMembersDialogProps {
  members: BrigadistOption[];
  targetBrigade: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function MoveMembersDialog({ members, targetBrigade, onCancel, onConfirm }: MoveMembersDialogProps) {
  const { t } = useTranslation(['admin', 'register']);

  return (
    <Dialog open={members.length > 0} onClose={onCancel} role="alertdialog" maxWidth="sm" fullWidth>
      <DialogTitle>{t('admin:teams.move.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('admin:teams.move.description', { brigade: targetBrigade })}</DialogContentText>
        <List dense>
          {members.map((member) => (
            <ListItem key={member.value} disableGutters>
              <ListItemText
                primary={member.label}
                secondary={t('admin:teams.move.current_brigade', { brigade: member.team?.name })}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('register:cancel')}</Button>
        <Button onClick={onConfirm} variant="contained">
          {t('admin:teams.move.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
