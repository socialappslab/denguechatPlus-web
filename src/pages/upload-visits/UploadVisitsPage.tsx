import { Alert, Box, Stack, Tooltip, Typography } from '@mui/material';
import Uploady, { BatchItem, useItemErrorListener, useItemFinishListener } from '@rpldy/uploady';
import { asUploadButton, UploadButtonProps } from '@rpldy/upload-button';
import UploadDropZone from '@rpldy/upload-drop-zone';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import Button from '@/themed/button/Button';
import { authApi } from '@/api/axios';
import Title from '@/themed/title/Title';

const { baseURL, headers } = authApi.defaults;

/**
 * Helper component to bridge Uploady events to the parent component.
 */
function UploadyEventBridge({
  onItemError,
  onItemFinish,
}: {
  onItemError: Parameters<typeof useItemErrorListener>[0];
  onItemFinish: Parameters<typeof useItemFinishListener>[0];
}) {
  useItemErrorListener(onItemError);
  useItemFinishListener(onItemFinish);
  return null;
}

function UploadButton(props: UploadButtonProps) {
  const { t } = useTranslation('translation');
  // @ts-expect-error i think there's a problem with the Button typings
  return <Button {...props} primary label={t('uploadVisits.button')} />;
}
const CustomUploadButton = asUploadButton(UploadButton);

export default function UploadVisitsPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation(['translation', 'errorCodes']);

  const [errors, setErrors] = useState<string[]>([]);

  const handleUploadError = useCallback(
    (obj: BatchItem) => {
      setErrors([]);
      if (!obj.uploadResponse.data.errors) {
        enqueueSnackbar(t('errorCodes:generic'), { variant: 'error' });
        return;
      }

      setErrors(obj.uploadResponse.data.errors.map((error: { detail: string }) => error?.detail));
      enqueueSnackbar(t('uploadVisits.errorToast'), {
        variant: 'error',
        autoHideDuration: 7000,
      });
    },
    [enqueueSnackbar, t],
  );

  const handleUploadSuccess = useCallback(
    (obj: BatchItem) => {
      setErrors([]);

      navigate('/upload-visits/success', {
        state: {
          visitSummaries: obj.uploadResponse.data.data.attributes.visitSummaries,
        },
      });
    },
    [navigate],
  );

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Title type="page2" label={t('uploadVisits.title')} />
        </Box>
        <Box>
          <Tooltip title={t('uploadVisits.downloadTemplate.tooltip')}>
            <Box>
              <Button
                component={Link}
                to="https://1drv.ms/x/c/3b0a1f5f47c9a2ff/EQAj-sSd6LZFjT2KJMwzoaQBfDmjDTaKbfZebiQ_Sm8QZQ"
                target="_blank"
                label={t('uploadVisits.downloadTemplate.button')}
                buttonType="medium"
              />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Uploady
        destination={{
          url: `${baseURL}/visits/bulk_upload`,
          headers: {
            'X-Authorization': headers['X-Authorization'],
            'X-Client-Device': headers['X-Client-Device'],
          },
        }}
        multiple={false}
        accept=".xlsx"
      >
        <UploadyEventBridge onItemError={handleUploadError} onItemFinish={handleUploadSuccess} />
        <Box
          component={UploadDropZone}
          onDragOverClassName="drag-over"
          grouped
          maxGroupSize={3}
          sx={{
            height: 200,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderStyle: 'dashed',
            borderColor: 'text.disabled',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ mb: 1 }}>{t('uploadVisits.dropZone')}</Typography>
            <CustomUploadButton />
          </Box>
        </Box>
      </Uploady>

      <Box sx={{ marginTop: 3 }}>
        {errors.length > 0 && (
          <>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              {t('uploadVisits.errorsFound')}
            </Typography>
            <Stack spacing={1}>
              {errors.map((error, index) => (
                <Alert severity="error" key={index}>
                  {error}
                </Alert>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
}
