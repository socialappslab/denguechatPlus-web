import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/axios';
import { FormSelectOption } from '@/schemas';
import { BaseEntity, Inspection, InspectionSelectable } from '@/schemas/entities';
import { UpdateInspection } from '@/schemas/update';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import FormSelect from '@/themed/form-select/FormSelect';
import Loader from '@/themed/loader/Loader';
import { convertToFormSelectOptions, extractAxiosErrorData } from '@/util';
import { Button } from '@/themed/button/Button';
import { FormInput } from '@/themed/form-input/FormInput';
import { Title } from '@/themed/title/Title';

type InspectionData = Record<keyof InspectionSelectable, ({ selected: boolean; value: string } & BaseEntity)[]>;
type InspectionFormOptions = Record<keyof InspectionSelectable, FormSelectOption[]>;

// Other Ids
const OtherIds = {
  waterSourceType: '6',
  containerProtection: '4',
  eliminationMethodType: '9',
} as const;

const containsOtherOption = (options: Record<string, string>[], otherId: (typeof OtherIds)[keyof typeof OtherIds]) =>
  options.some((option) => option.value === otherId);

const convertSchemaToPayload = (values: Inspection): UpdateInspection => {
  return {
    breeding_site_type_id: values.breadingSiteType,
    other_elimination_method: containsOtherOption(values.eliminationMethodTypes, OtherIds.eliminationMethodType)
      ? values.eliminationMethodTypeOther
      : '',
    other_protection: containsOtherOption(values.containerProtections, OtherIds.containerProtection)
      ? values.containerProtectionOther
      : '',
    ...(values.location ? { location: values.location } : {}),
    was_chemically_treated: values.wasChemicallyTreated,
    water_source_other: containsOtherOption(values.waterSourceTypes, OtherIds.waterSourceType)
      ? values.waterSourceOther
      : '',
    container_protection_ids: values.containerProtections.map((i) => i.value),
    elimination_method_type_ids: values.eliminationMethodTypes.map((i) => Number(i.value)),
    water_source_type_ids: values.waterSourceTypes.map((i) => i.value),
    type_content_ids: values.typeContents.map((i) => i.value),
  };
};

interface EditInspectionDialogProps {
  inspection: Inspection | null;
  visitId: number;
  handleClose: () => void;
  inspectionData?: InspectionData;
  optionsData: InspectionFormOptions;
}

interface PreloadInspectionProps {
  inspection: Inspection | null;
  visitId: number;
  handleClose: () => void;
}

const EditInspectionDialog = ({
  inspection,
  handleClose,
  inspectionData,
  visitId,
  optionsData,
}: EditInspectionDialogProps) => {
  const { t } = useTranslation(['register', 'admin']);

  const extractIdsFromInspections = (values?: ({ selected: boolean; value: string } & BaseEntity)[]) => {
    if (!values) return null;
    return values.filter((i) => i.selected).map((i) => ({ label: i.name, value: i.value?.toString() }));
  };

  const extractIdFromInspections = (values?: ({ selected: boolean; value: string } & BaseEntity)[]) => {
    if (!values) return '';
    return extractIdsFromInspections(values)?.pop()?.value?.toString();
  };

  const defaultValues = {
    breadingSiteType: extractIdFromInspections(inspectionData?.breadingSiteType) || '',
    location:
      extractIdFromInspections(inspectionData?.locations) ||
      ((inspectionData as { location?: string } | undefined)?.location ?? ''),
    containerProtections: extractIdsFromInspections(inspectionData?.containerProtections) || '',
    eliminationMethodTypes: extractIdsFromInspections(inspectionData?.eliminationMethodTypes) || '',
    typeContents: extractIdsFromInspections(inspectionData?.typeContents) || '',
    wasChemicallyTreated: extractIdFromInspections(inspectionData?.wasChemicallyTreated) || '',
    waterSourceTypes: extractIdsFromInspections(inspectionData?.waterSourceTypes) || '',
    containerProtectionOther: inspectionData?.containerProtectionOther,
    eliminationMethodTypeOther: inspectionData?.eliminationMethodTypeOther,
    status: t(`admin:visits.status.${inspection?.status}`),
    waterSourceOther: inspectionData?.waterSourceOther,
  };

  const methods = useForm<Inspection>({
    // @ts-expect-error status is not compatible
    defaultValues,
  });

  const { handleSubmit, watch, setError } = methods;
  const inspectionDataPhotoUrl = (inspectionData as { photoUrl?: { url?: string; photo_url?: string } } | undefined)
    ?.photoUrl;

  type PhotoAction = 'keep' | 'delete' | 'replace';
  const [photoAction, setPhotoAction] = useState<PhotoAction>('keep');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(
    inspectionDataPhotoUrl?.url ?? inspectionDataPhotoUrl?.photo_url ?? inspection?.photoUrl?.url ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setSelectedFile(file);
    setPhotoAction('replace');
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const handlePhotoDelete = () => {
    if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreviewUrl);
    }

    setPhotoAction('delete');
    setPhotoPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitHandler: SubmitHandler<Inspection> = async (values) => {
    setIsSubmitting(true);
    try {
      const url = `/visits/${visitId}/inspections/${inspection?.id}`;
      const payload = convertSchemaToPayload(values);

      if (photoAction === 'replace' && selectedFile) {
        const formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(`${key}[]`, String(item));
            });
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        formData.append('photo', selectedFile);

        await authApi.put(url, formData, {
          headers: { 'Content-Type': undefined },
        });
      } else if (photoAction === 'delete') {
        await authApi.put(url, { ...payload, delete_photo: true, photo: null });
      } else {
        await authApi.put(url, payload);
      }

      enqueueSnackbar(t('admin:visits.inspection.edit.success'), {
        variant: 'success',
      });

      handleClose();
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerProtectionsContainsOtherOption = containsOtherOption(
    watch('containerProtections'),
    OtherIds.containerProtection,
  );
  const waterSourceTypesContainsOtherOption = containsOtherOption(watch('waterSourceTypes'), OtherIds.waterSourceType);
  const eliminationMethodTypesContainsOtherOption = containsOtherOption(
    watch('eliminationMethodTypes'),
    OtherIds.eliminationMethodType,
  );

  return (
    <div className="flex flex-col py-6 px-2">
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
          className="w-full p-8"
        >
          <Title
            type="section"
            className="self-center mb-8i w-full"
            label={t('admin:visits.inspection.containerType')}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormSelect
                className="mt-2"
                name="breadingSiteType"
                label={t('admin:visits.inspection.columns.breadingSiteType')}
                options={optionsData.breadingSiteType}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormSelect
                className="mt-2"
                name="location"
                label={t('admin:visits.inspection.columns.location')}
                options={optionsData.locations}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2"
                name="waterSourceTypes"
                label={t('admin:visits.inspection.columns.waterSourceType')}
                options={optionsData.waterSourceTypes}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="waterSourceOther"
                disabled={!waterSourceTypesContainsOtherOption}
                label={t('admin:visits.inspection.columns.waterSourceTypeOther')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2"
                name="containerProtections"
                label={t('admin:visits.inspection.columns.containerProtection')}
                options={optionsData.containerProtections}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="containerProtectionOther"
                disabled={!containerProtectionsContainsOtherOption}
                label={t('admin:visits.inspection.columns.containerProtectionOther')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="wasChemicallyTreated"
                label={t('admin:visits.inspection.columns.wasChemicallyTreated')}
                options={optionsData.wasChemicallyTreated}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2"
                name="typeContents"
                label={t('admin:visits.inspection.columns.typeContents')}
                options={optionsData.typeContents}
              />
            </Grid>
          </Grid>

          <Title
            type="section"
            className="self-center mb-8i w-full mt-8"
            label={t('admin:visits.inspection.actionsPerfomed')}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormMultipleSelect
                className="mt-2"
                name="eliminationMethodTypes"
                label={t('admin:visits.inspection.columns.eliminationMethodType')}
                options={optionsData.eliminationMethodTypes}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="eliminationMethodTypeOther"
                disabled={!eliminationMethodTypesContainsOtherOption}
                label={t('admin:visits.inspection.columns.eliminationMethodTypeOther')}
                type="text"
              />
            </Grid>
          </Grid>

          <div className="mt-8 flex items-start gap-4">
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded border border-gray-300">
              {photoPreviewUrl ? (
                <Link to={photoPreviewUrl} target="_blank" rel="noreferrer">
                  <img src={photoPreviewUrl} alt="" className="h-full w-full object-cover" />
                </Link>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                  {t('admin:visits.inspection.photo.noPhoto')}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <Button
                buttonType="medium"
                label={t('admin:visits.inspection.photo.upload')}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              />
              {photoPreviewUrl && (
                <Button
                  buttonType="medium"
                  primary={false}
                  label={t('admin:visits.inspection.photo.delete')}
                  onClick={handlePhotoDelete}
                  type="button"
                />
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={isSubmitting} type="submit" />
            </div>

            <div>
              <Button buttonType="large" primary={false} disabled={false} label={t('back')} onClick={handleClose} />
            </div>
          </div>
        </Box>
      </FormProvider>
    </div>
  );
};

const PreloadInspection = ({ inspection, handleClose, visitId }: PreloadInspectionProps) => {
  const [inspectionData, setInspectionData] = useState<InspectionData>();
  const [optionsData, setOptionsData] = useState<InspectionFormOptions>({
    breadingSiteType: [{ value: '', label: '' }],
    containerProtections: [{ value: '', label: '' }],
    eliminationMethodTypes: [{ value: '', label: '' }],
    locations: [{ value: '', label: '' }],
    typeContents: [{ value: '', label: '' }],
    wasChemicallyTreated: [{ value: '', label: '' }],
    waterSourceTypes: [{ value: '', label: '' }],
  });

  const [{ data, loading }] = useAxios(
    {
      url: `/visits/${visitId}/inspections/${inspection?.id}`,
    },
    { useCache: false },
  );

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize(data) as InspectionData;

      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
      }

      const optionsDataTemp: InspectionFormOptions = {
        breadingSiteType: convertToFormSelectOptions(deserializedData.breadingSiteType),
        containerProtections: convertToFormSelectOptions(deserializedData.containerProtections),
        eliminationMethodTypes: convertToFormSelectOptions(deserializedData.eliminationMethodTypes),
        locations: convertToFormSelectOptions(deserializedData.locations || []),
        typeContents: convertToFormSelectOptions(deserializedData.typeContents),
        wasChemicallyTreated: convertToFormSelectOptions(
          deserializedData.wasChemicallyTreated,
          undefined,
          undefined,
          'value',
        ),
        waterSourceTypes: convertToFormSelectOptions(deserializedData.waterSourceTypes),
      };

      setOptionsData(optionsDataTemp);
      setInspectionData(deserializedData);
    }
  }, [data]);

  if (!inspectionData || loading) {
    return <Loader />;
  }

  return (
    <EditInspectionDialog
      inspection={inspection}
      handleClose={handleClose}
      visitId={visitId}
      inspectionData={inspectionData}
      optionsData={optionsData}
    />
  );
};

export default PreloadInspection;
