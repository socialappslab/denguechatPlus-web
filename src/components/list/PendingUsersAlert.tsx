import { Alert, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PendingUsersAlertProps {
  count?: number;
  onSeePending: () => void;
}

export default function PendingUsersAlert({ count, onSeePending }: PendingUsersAlertProps) {
  const { t } = useTranslation('admin');

  if (!count) return null;

  return (
    <Alert
      className="mb-8"
      severity="info"
      action={
        <Button color="inherit" size="small" onClick={onSeePending}>
          {t('users.seePendingApproval')}
        </Button>
      }
    >
      {t('users.pendingApproval', { count })}
    </Alert>
  );
}
