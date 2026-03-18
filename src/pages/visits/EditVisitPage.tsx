import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Chip, Container, Dialog, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useQuery } from '@tanstack/react-query';
import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { capitalize } from 'lodash-es';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { ErrorResponse, Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { authApi } from '@/api/axios';
import GreenHouse from '@/assets/icons/house-green.svg';
import RedHouse from '@/assets/icons/house-red.svg';
import YellowHouse from '@/assets/icons/house-yellow.svg';
import EditInspectionDialog from '@/components/dialog/EditInspectionDialog';
import FilteredDataTable from '@/components/list/FilteredDataTable';
import useLangContext from '@/hooks/useLangContext';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import { FormSelectOption } from '@/schemas';
import { BaseEntity, House, Inspection, InspectionStatus, Visit } from '@/schemas/entities';
import { UpdateVisit, UpdateVisitInputType } from '@/schemas/update';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import FormSelectAutocomplete from '@/themed/form-select-autocomplete/FormSelectAutocomplete';
import FormSelect from '@/themed/form-select/FormSelect';
import { HeadCell } from '@/themed/table/DataTable';
import Text from '@/themed/text/Text';
import { convertToFormSelectOptions, downloadFile, extractAxiosErrorData, formatDateFromString } from '@/util';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';

enum Host {
  seniorAdult = 'Senior adult',
  adultMan = 'Adult man',
  adultWoman = 'Adult woman',
  youngMan = 'Young man',
  youngWoman = 'Young woman',
  children = 'Children',
}

const QUESTION_KEY_FORMAT = /^question_\d+_\d+$/;
const START_SIDE_QUESTION_KEY_FALLBACK = 'question_5_0';

const findStartSideQuestionKey = (
  answers: Array<Record<string, string | number>>,
  startSideOptions: FormSelectOption[],
): string | null => {
  const startSideOptionIdSet = new Set(startSideOptions.map((option) => option.value));
  const matchedQuestion = answers
    .flatMap((answer) => Object.entries(answer))
    .find(([key, value]) => QUESTION_KEY_FORMAT.test(key) && startSideOptionIdSet.has(String(value)));

  return matchedQuestion?.[0] ?? null;
};

const updateStartSideAnswer = (
  answers: Array<Record<string, string | number>>,
  startSideOptions: FormSelectOption[],
  selectedStartSideOptionId: string,
): Array<Record<string, string | number>> => {
  const questionKey = findStartSideQuestionKey(answers, startSideOptions) ?? START_SIDE_QUESTION_KEY_FALLBACK;
  let wasUpdated = false;

  const updatedAnswers = answers.map((answer) => {
    if (Object.prototype.hasOwnProperty.call(answer, questionKey)) {
      wasUpdated = true;
      return {
        ...answer,
        [questionKey]: Number(selectedStartSideOptionId),
      };
    }

    return answer;
  });

  if (wasUpdated) return updatedAnswers;

  return [
    ...updatedAnswers,
    {
      [questionKey]: Number(selectedStartSideOptionId),
    },
  ];
};

const renderColor = (color: InspectionStatus) => {
  const colorMapping = {
    Verde: 'green',
    Green: 'green',

    Amarillo: 'yellow',
    Amarelo: 'yellow',
    Yellow: 'yellow',

    Rojo: 'red',
    Vermelho: 'red',
    Red: 'red',
  };

  return (
    <Box className="flex">
      <Box className={`w-5 h-5 bg-${colorMapping[color]}-600 mr-3 rounded-full`} />
      {capitalize(color)}
    </Box>
  );
};

const VisitDataTable = FilteredDataTable<Inspection>;

const headCells: HeadCell<Inspection>[] = [
  {
    id: 'id',
    label: 'id',
  },
  {
    id: 'breadingSiteType',
    label: 'breedingSiteType',
  },
  {
    id: 'hasWater',
    label: 'hasWater',
  },
  {
    id: 'typeContents',
    label: 'typeContents',
  },
  {
    id: 'status',
    label: 'containerStatus',
    render: (row) => renderColor(row.status),
  },
];

export interface EditVisitProps {
  visit: Visit;
}

type StatusPlain = 'Rojo' | 'Verde' | 'Amarillo';

interface HouseStatusProps {
  color: string | StatusPlain;
}

const ColorMap = {
  Rojo: 'red',
  Verde: 'green',
  Amarillo: 'yellow',
} as const;

const IconMap = {
  red: RedHouse,
  green: GreenHouse,
  yellow: YellowHouse,
};

function useDownloadCsvQuery(visitId: number) {
  return useQuery({
    queryKey: ['downloadCsv', visitId],
    queryFn: async () => (await authApi.get(`/visits/${visitId}/download_information`)).data,
    enabled: false,
  });
}

const HouseStatusBanner = ({ color: colorPlain }: HouseStatusProps) => {
  const { t } = useTranslation('admin');
  const color = ColorMap[colorPlain as StatusPlain];
  return (
    <Box className="my-4 flex items-center">
      <Box className={`bg-${color}-600 w-20 h-20 rounded-full mr-4 flex items-center justify-center`}>
        <img src={IconMap[color]} alt="icon" className="w-7/12" />
      </Box>
      <Box className="flex justify-center flex-col h-max">
        <Title
          type="section"
          className="text-xl mb-0 font-semibold"
          label={`${t('visits.inspection.inspectionStatus')} ${t(`visits.status.${color}`)}`}
        />
        <Title type="subsection" className="mb-0" label={t('visits.inspection.statusDescription')} />
      </Box>
    </Box>
  );
};

export function EditVisit({ visit }: EditVisitProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'admin', 'translation', 'questionnaire']);
  const langContext = useLangContext();
  const navigate = useNavigate();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [inspectionToDelete, setInspectionToDelete] = useState<Inspection | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [inspectionUpdateControl, setInspectionUpdateControl] = useState(0);

  const rootElement = document.getElementById('root-app');
  // fetched from attributes (passed as state) update after endpoint
  const status = visit.visitStatus;
  const date = formatDateFromString(langContext.state.selected, visit.visitedAt);

  const [userOptions, setUserOptions] = useState<FormSelectOption[]>([]);
  const startSideOptions: FormSelectOption[] = (visit.startSide || []).map((option) => ({
    label: option.label,
    value: String(option.optionId),
  }));

  const [{ data: usersData, loading: loadingUsers }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: `/users?page[number]=1&page[size]=100&filter[roles][name]=brigadista&filter[team_id]=${(visit.team as BaseEntity)?.id}`,
  });

  useEffect(() => {
    if (!usersData) return;
    const deserializedData = deserialize(usersData);
    if (Array.isArray(deserializedData)) {
      const users = convertToFormSelectOptions(deserializedData, 'firstName', 'lastName');
      setUserOptions(users);
    }
  }, [usersData]);

  const defaultHouse = {
    value: String((visit.house as House).id),
    label: String((visit.house as House).reference_code),
  };

  const methods = useForm({
    defaultValues: {
      site: defaultHouse,
      date,
      brigadist: visit.brigadist ? String((visit?.brigadist as BaseEntity)?.id) : '',
      brigade: visit.team ? String((visit?.team as BaseEntity)?.name) : '',
      visitPermission: (visit.visitPermission || []).find((i) => i.selected)?.label ?? '',
      visitPermissionOther:
        (visit.visitPermission || []).find((i) => i.selected && i.typeOption === 'textArea')?.other ?? '',
      visitStartPlace: String((visit.startSide || []).find((i) => i.selected)?.optionId ?? ''),
      household: visit?.host?.map((i) => ({ label: i, value: i })) || [],
      familyEducationTopics: (visit.familyEducationTopics || [])
        .filter((i) => i.checked)
        .map((i) => ({
          label: i.name,
          value: i.name,
        })),
      otherFamilyEducationTopic: visit.otherFamilyEducationTopic ?? '',
      notes: visit.notes ?? '',
    },
  });

  const { handleSubmit, watch, setError, setValue } = methods;

  const { udpateMutation: updateVisitMutation, loading: updateVisitLoading } = useUpdateMutation<UpdateVisit, Visit>(
    `visits/${visit?.id}`,
  );

  const downloadCsv = useDownloadCsvQuery(Number(visit.id));
  const possibleDuplicateVisitIds = visit.possibleDuplicateVisitIds ?? [];
  const offlineVisitStatus = visit.wasOffline ? t('admin:visits.metadata.yes') : t('admin:visits.metadata.no');
  const offlineVisitLabel = t('admin:visits.metadata.offlineLabel');
  const { uploadFile } = visit;
  const uploadFileLabel = t('admin:visits.metadata.uploadFileLabel');
  const uploadFileNoneLabel = t('admin:visits.metadata.uploadFileNone');
  const uploadFileChipLabel = uploadFile?.filename ?? t('admin:visits.metadata.uploadFileDownload');
  const duplicateLabels = possibleDuplicateVisitIds.map((id) => t('admin:visits.metadata.duplicateLabel', { id }));
  const hasDuplicateVisits = duplicateLabels.length > 0;
  const duplicatesHeadingLabel = t('admin:visits.metadata.duplicatesHeading');
  const noDuplicatesValue = t('admin:visits.metadata.noDuplicatesValue');

  const convertSchemaToPayload = (values: UpdateVisitInputType): UpdateVisit => {
    const selectedPermissionOption = (visit.visitPermission || []).find((i) => i.label === values.visitPermission);

    return {
      host: values.household.map((i) => i.label),
      house_id: (values.site as FormSelectOption).value,
      notes: values.notes,
      user_account_id: values.brigadist,
      visited_at: values.date,
      family_education_topics: values.familyEducationTopics.map((i) => i.value),
      other_family_education_topic: values.otherFamilyEducationTopic,
      visit_permission_option_id: selectedPermissionOption?.optionId,
      visit_permission_other: selectedPermissionOption?.typeOption === 'textArea' ? values.visitPermissionOther : null,
    };
  };

  const onSubmitHandler: SubmitHandler<UpdateVisitInputType> = async (values) => {
    try {
      const payload: UpdateVisit = convertSchemaToPayload(values);
      const answers = values.visitStartPlace
        ? updateStartSideAnswer(visit.answers, startSideOptions, values.visitStartPlace)
        : visit.answers;

      await updateVisitMutation({ ...payload, answers });

      enqueueSnackbar(t('admin:cities.edit.success'), {
        variant: 'success',
      });

      navigate('/visits');
    } catch (error) {
      const errorData = extractAxiosErrorData(error);

      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-explicit-any
      errorData?.errors?.forEach((error: any) => {
        if (error?.field && watch(error.field)) {
          setError(error.field, {
            type: 'manual',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            message: t(`errorCodes:${String(error?.error_code)}` || 'errorCodes:genericField', {
              field: watch(error.field),
            }),
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          enqueueSnackbar(t(`errorCodes:${error?.error_code || 'generic'}`), {
            variant: 'error',
          });
        }
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic'), {
          variant: 'error',
        });
      }
    }
  };

  const handleDeleteInspection = async (inspection: Inspection) => {
    try {
      await updateVisitMutation({ delete_inspection_ids: [inspection.id] });
      setInspectionUpdateControl((value) => value + 1);
      setInspectionToDelete(null);
      enqueueSnackbar(t('admin:visits.inspection.delete.success'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(t('errorCodes:generic'), {
        variant: 'error',
      });
    }
  };

  const actions = (inspection: Inspection, loading?: boolean) => {
    return (
      <div className="flex flex-row items-center gap-1">
        <Tooltip title={t('translation:table.actions.edit')}>
          <IconButton
            size="small"
            color="primary"
            disabled={!!loading || updateVisitLoading}
            onClick={() => {
              setSelectedInspection(inspection);
              setOpenEditDialog(true);
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={t('translation:table.actions.delete')}>
          <IconButton
            size="small"
            color="error"
            disabled={!!loading || updateVisitLoading}
            onClick={() => setInspectionToDelete(inspection)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const handleClose = () => setOpenEditDialog(false);

  const handleDownload = async () => {
    try {
      const response = await downloadCsv.refetch();
      downloadFile('fileName', 'text/csv', response.data);
    } catch (error) {
      enqueueSnackbar(t('errorCodes:generic'), {
        variant: 'error',
      });
    }
  };

  const familyEducationTopicsContainsOtherOption = watch('familyEducationTopics').some(
    (option) =>
      option.value === 'Otro tema importante' ||
      option.value === 'Another important topic' ||
      option.value === 'Outro tópico importante',
  );

  const selectedVisitPermission = watch('visitPermission');
  const visitPermissionIsOther = (visit.visitPermission || []).some(
    (i) => i.typeOption === 'textArea' && i.label === selectedVisitPermission,
  );

  useEffect(() => {
    if (!visitPermissionIsOther) {
      setValue('visitPermissionOther', '');
    }
  }, [visitPermissionIsOther, setValue]);

  return (
    <Container
      className="bg-background w-full"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate autoComplete="off">
          <Box className="flex items-center mb-5">
            <Text type="menuItem" className="opacity-50">
              {t('admin:visits.title')}
            </Text>
            <Text className="ml-3 mr-3 opacity-10" type="menuItem">
              /
            </Text>
            <Text type="menuItem" className="opacity-50">
              {date}
            </Text>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box className="grow">
              <Title type="section" className="mb-1" label={t('admin:visits.visitInformation')} />
              <Text type="menuItem" className="mb-2">
                {t('admin:visits.questionnaire')} 1.0.0
              </Text>
            </Box>

            <Box>
              <LoadingButton onClick={handleDownload} loading={downloadCsv.isLoading}>
                {t('admin:visits.exportData')}
              </LoadingButton>
            </Box>
          </Box>

          <HouseStatusBanner color={status} />

          <Stack spacing={2} sx={{ marginBottom: 4 }}>
            <Box>
              <Typography variant="body2" className="text-sm text-darkest">
                <Box component="span" className="font-semibold">
                  {offlineVisitLabel}
                </Box>
                <Box component="span" className="font-normal ml-1">
                  {offlineVisitStatus}
                </Box>
              </Typography>
            </Box>
            <Box>
              {uploadFile ? (
                <>
                  <Typography variant="body2" className="mb-2 text-sm font-semibold text-darkest">
                    {uploadFileLabel}
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    <Chip
                      component="a"
                      href={uploadFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      label={uploadFileChipLabel}
                      clickable
                      color="primary"
                      variant="outlined"
                      download={uploadFile.filename ?? undefined}
                    />
                  </Box>
                </>
              ) : (
                <Typography variant="body2" className="text-sm text-darkest">
                  <Box component="span" className="font-semibold">
                    {uploadFileLabel}
                  </Box>
                  <Box component="span" className="font-normal ml-1">
                    {uploadFileNoneLabel}
                  </Box>
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body2" className="mb-2 text-sm text-darkest">
                <Box component="span" className="font-semibold">
                  {duplicatesHeadingLabel}
                </Box>
                {!hasDuplicateVisits && (
                  <Box component="span" className="font-normal ml-1">
                    {noDuplicatesValue}
                  </Box>
                )}
              </Typography>
              {hasDuplicateVisits && (
                <Box className="flex flex-wrap gap-2">
                  {possibleDuplicateVisitIds.map((duplicateId, index) => (
                    <Chip
                      key={duplicateId}
                      label={duplicateLabels[index]}
                      component={RouterLink}
                      to={`/visits/${duplicateId}/edit`}
                      clickable
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormSelectAutocomplete
                defaultValue={defaultHouse}
                name="site"
                label={t('admin:visits.inspection.siteNumber')}
                entityKey={'referenceCode' as keyof BaseEntity}
                endpoint="/houses"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="date"
                label={t('admin:visits.inspection.date')}
                type="date-picker"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                name="brigadist"
                className="mt-2"
                label={t('admin:visits.inspection.brigadist')}
                options={userOptions}
                loading={loadingUsers}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                disabled
                className="mt-2 h-full"
                name="brigade"
                label={t('admin:visits.inspection.brigade')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="visitPermission"
                label={t('admin:visits.inspection.visitPermission')}
                options={(visit.visitPermission || []).map((i) => ({
                  label: i.label,
                  value: i.label,
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="visitPermissionOther"
                disabled={!visitPermissionIsOther}
                label={t('admin:visits.inspection.visitPermissionOther')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2 h-full"
                name="household"
                label={t('admin:visits.inspection.household')}
                options={Object.keys(Host).map((i) => ({
                  label: t(`questionnaire:host.${i}`),
                  value: t(`questionnaire:host.${i}`),
                }))}
                defaultValue={(visit.familyEducationTopics || [])
                  .filter((i) => i.checked)
                  .map((i) => ({
                    label: i.name,
                    value: i.name,
                  }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="visitStartPlace"
                label={t('admin:visits.inspection.visitStart')}
                options={startSideOptions}
                disabled={startSideOptions.length === 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2 h-full"
                name="familyEducationTopics"
                label={t('admin:visits.inspection.familyEducationTopics')}
                options={(visit.familyEducationTopics || []).map((i) => ({
                  label: i.name,
                  value: i.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="otherFamilyEducationTopic"
                disabled={!familyEducationTopicsContainsOtherOption}
                label={t('admin:visits.inspection.otherFamilyEducationTopic')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput className="mt-2 h-full" name="notes" label={t('admin:visits.inspection.notes')} type="text" />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} type="submit" />
            </div>

            <div>
              <Button buttonType="large" primary={false} label={t('back')} onClick={() => navigate('/visits')} />
            </div>
          </div>
        </Box>
      </FormProvider>

      <Title type="section" className="self-start mt-10 mb-1" label={t('admin:visits.inspectionData')} />

      <VisitDataTable
        endpoint={`visits/${visit.id}/inspections`}
        defaultFilter="brigadist"
        headCells={headCells}
        pageSize={5}
        actions={actions}
        searchable={false}
        updateControl={inspectionUpdateControl}
      />

      <Dialog
        container={rootElement}
        fullWidth
        maxWidth="xs"
        open={!!inspectionToDelete}
        onClose={() => setInspectionToDelete(null)}
      >
        <div className="flex flex-col py-7 px-8">
          <Title type="section" label={t('translation:table.actions.delete')} className="mb-4" />
          <p className="text-sm text-darkest">{t('admin:visits.inspection.delete.confirm')}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button
                buttonType="medium"
                primary={false}
                disabled={updateVisitLoading}
                label={t('register:cancel')}
                onClick={() => setInspectionToDelete(null)}
              />
            </div>
            <div>
              <Button
                buttonType="medium"
                disabled={updateVisitLoading}
                label={t('translation:table.actions.delete')}
                onClick={() => inspectionToDelete && handleDeleteInspection(inspectionToDelete)}
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog container={rootElement} fullWidth maxWidth="md" open={openEditDialog} onClose={handleClose}>
        {openEditDialog && (
          <EditInspectionDialog
            visitId={visit.id as number}
            handleClose={() => {
              setOpenEditDialog(false);
              setInspectionUpdateControl((c) => c + 1);
            }}
            inspection={selectedInspection}
          />
        )}
      </Dialog>
    </Container>
  );
}

export default EditVisit;
