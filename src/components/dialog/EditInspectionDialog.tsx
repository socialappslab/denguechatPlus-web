import { Box, Grid } from '@mui/material';

import { FormProvider, useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { authApi } from '@/api/axios';
import useLangContext from '@/hooks/useLangContext';
import type { FormSelectOption } from '@/schemas';
import type { BaseEntity, Inspection, InspectionSelectable } from '@/schemas/entities';
import type { UpdateInspection } from '@/schemas/update';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import FormSelect from '@/themed/form-select/FormSelect';
import Loader from '@/themed/loader/Loader';
import { convertToFormSelectOptions, extractAxiosErrorData } from '@/util';
import { Button } from '@/themed/button/Button';
import FormInput from '@/themed/form-input/FormInput';
import { Title } from '@/themed/title/Title';

type InspectionOption = { selected: boolean; value: string } & BaseEntity;
type InspectionData = Record<keyof InspectionSelectable, InspectionOption[]> & {
  containerProtectionOther?: string;
  eliminationMethodTypeOther?: string;
  location?: string;
  photoUrl?: { url?: string; photo_url?: string } | '';
  waterSourceOther?: string;
};
type InspectionFormOption = FormSelectOption & { isOther?: boolean };
type InspectionFormOptions = Record<keyof InspectionSelectable, InspectionFormOption[]>;
type InspectionFormValues = {
  breadingSiteType: string;
  containerProtectionOther: string;
  containerProtections: InspectionFormOption[];
  eliminationMethodTypeOther: string;
  eliminationMethodTypes: InspectionFormOption[];
  location: string;
  typeContents: InspectionFormOption[];
  wasChemicallyTreated: string;
  waterSourceOther: string;
  waterSourceTypes: InspectionFormOption[];
};
type QuestionnaireOption = {
  name: string;
  optionType?: string;
  resourceId?: number | string | null;
};
type QuestionnaireData = {
  questions?: {
    options: QuestionnaireOption[];
    resourceName?: string | null;
  }[];
};

// Other Ids
const OtherIds = {
  waterSourceType: '6',
  containerProtection: '4',
  eliminationMethodType: '9',
} as const;

const containsOtherOption = (options: InspectionFormOption[], otherId: (typeof OtherIds)[keyof typeof OtherIds]) =>
  options.some((option) => option.isOther || option.value === otherId);

const convertSchemaToPayload = (values: InspectionFormValues): UpdateInspection => {
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
  onSaved: () => void;
  inspectionData?: InspectionData;
  optionsData: InspectionFormOptions;
}

interface PreloadInspectionProps {
  inspection: Inspection | null;
  visitId: number;
  handleClose: () => void;
  onSaved: () => void;
}

const EditInspectionDialog = ({
  inspection,
  handleClose,
  onSaved,
  inspectionData,
  visitId,
  optionsData,
}: EditInspectionDialogProps) => {
  const { t } = useTranslation(['register', 'admin']);
  const isCreating = inspection === null;

  const extractIdsFromInspections = (values?: InspectionOption[]) => {
    if (!values) return null;
    return values.filter((i) => i.selected).map((i) => ({ label: i.name, value: i.value?.toString() }));
  };

  const extractIdFromInspections = (values?: InspectionOption[]) => {
    if (!values) return '';
    return extractIdsFromInspections(values)?.pop()?.value?.toString();
  };

  const defaultValues = {
    breadingSiteType: isCreating ? '' : extractIdFromInspections(inspectionData?.breadingSiteType) || '',
    location: isCreating ? '' : extractIdFromInspections(inspectionData?.locations) || inspectionData?.location || '',
    containerProtections: isCreating ? [] : extractIdsFromInspections(inspectionData?.containerProtections) || [],
    eliminationMethodTypes: isCreating ? [] : extractIdsFromInspections(inspectionData?.eliminationMethodTypes) || [],
    typeContents: isCreating ? [] : extractIdsFromInspections(inspectionData?.typeContents) || [],
    wasChemicallyTreated: isCreating ? '' : extractIdFromInspections(inspectionData?.wasChemicallyTreated) || '',
    waterSourceTypes: isCreating ? [] : extractIdsFromInspections(inspectionData?.waterSourceTypes) || [],
    containerProtectionOther: isCreating ? '' : inspectionData?.containerProtectionOther || '',
    eliminationMethodTypeOther: isCreating ? '' : inspectionData?.eliminationMethodTypeOther || '',
    waterSourceOther: isCreating ? '' : inspectionData?.waterSourceOther || '',
  } satisfies InspectionFormValues;

  const methods = useForm<InspectionFormValues>({ defaultValues });

  const { handleSubmit, setError, control, getValues } = methods;
  const inspectionDataPhotoUrl =
    inspectionData?.photoUrl && typeof inspectionData.photoUrl === 'object' ? inspectionData.photoUrl : undefined;

  type PhotoAction = 'keep' | 'delete' | 'replace';
  const [photoAction, setPhotoAction] = useState<PhotoAction>('keep');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(
    isCreating
      ? null
      : (inspectionDataPhotoUrl?.url ?? inspectionDataPhotoUrl?.photo_url ?? inspection?.photoUrl?.url ?? null),
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

  const onSubmitHandler: SubmitHandler<InspectionFormValues> = async (values) => {
    if (!values.breadingSiteType) {
      setError('breadingSiteType', { type: 'required', message: '*' });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isCreating ? `/visits/${visitId}/inspections` : `/visits/${visitId}/inspections/${inspection.id}`;
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

        await authApi.request({
          url,
          method: isCreating ? 'POST' : 'PUT',
          data: formData,
          headers: { 'Content-Type': undefined },
        });
      } else if (photoAction === 'delete') {
        await authApi.put(url, { ...payload, delete_photo: true, photo: null });
      } else if (isCreating) {
        await authApi.post(url, payload);
      } else {
        await authApi.put(url, payload);
      }

      enqueueSnackbar(
        t(isCreating ? 'admin:visits.inspection.create.success' : 'admin:visits.inspection.edit.success'),
        {
          variant: 'success',
        },
      );

      onSaved();
    } catch (error) {
      const errorData = extractAxiosErrorData(error);

      errorData?.errors?.forEach((apiError) => {
        const fieldMap: Partial<Record<string, keyof InspectionFormValues>> = {
          breeding_site_type_id: 'breadingSiteType',
          container_protection_ids: 'containerProtections',
          elimination_method_type_ids: 'eliminationMethodTypes',
          location: 'location',
          type_content_ids: 'typeContents',
          was_chemically_treated: 'wasChemicallyTreated',
          water_source_type_ids: 'waterSourceTypes',
        };
        const formField = apiError.field ? fieldMap[apiError.field] : undefined;

        if (formField) {
          setError(formField, {
            type: 'manual',
            message: t(`errorCodes:${String(apiError.error_code)}` as never, {
              field: String(getValues(formField)),
            }),
          });
        } else {
          enqueueSnackbar(t(`errorCodes:${String(apiError.error_code)}` as never), {
            variant: 'error',
          });
        }
      });

      if (!errorData?.errors || errorData?.errors.length === 0) {
        enqueueSnackbar(t('errorCodes:generic' as never), {
          variant: 'error',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerProtections = useWatch({ control, name: 'containerProtections' });
  const waterSourceTypes = useWatch({ control, name: 'waterSourceTypes' });
  const eliminationMethodTypes = useWatch({ control, name: 'eliminationMethodTypes' });

  const containerProtectionsContainsOtherOption = containsOtherOption(
    containerProtections,
    OtherIds.containerProtection,
  );
  const waterSourceTypesContainsOtherOption = containsOtherOption(waterSourceTypes, OtherIds.waterSourceType);
  const eliminationMethodTypesContainsOtherOption = containsOtherOption(
    eliminationMethodTypes,
    OtherIds.eliminationMethodType,
  );

  return (
    <div className="flex flex-col px-2 py-6">
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
          className="w-full p-8"
        >
          <div id={isCreating ? 'create-inspection-dialog-title' : 'edit-inspection-dialog-title'}>
            <Title
              type="section"
              className="mb-8i w-full self-center"
              label={t('admin:visits.inspection.containerType')}
            />
          </div>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 12,
              }}
            >
              <FormSelect
                className="mt-2"
                name="breadingSiteType"
                label={t('admin:visits.inspection.columns.breadingSiteType')}
                options={optionsData.breadingSiteType}
                required
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12,
              }}
            >
              <FormSelect
                className="mt-2"
                name="location"
                label={t('admin:visits.inspection.columns.location')}
                options={optionsData.locations}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormMultipleSelect
                className="mt-2"
                name="waterSourceTypes"
                label={t('admin:visits.inspection.columns.waterSourceType')}
                options={optionsData.waterSourceTypes}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormInput
                className="mt-2"
                name="waterSourceOther"
                disabled={!waterSourceTypesContainsOtherOption}
                label={t('admin:visits.inspection.columns.waterSourceTypeOther')}
                type="text"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormMultipleSelect
                className="mt-2"
                name="containerProtections"
                label={t('admin:visits.inspection.columns.containerProtection')}
                options={optionsData.containerProtections}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormInput
                className="mt-2"
                name="containerProtectionOther"
                disabled={!containerProtectionsContainsOtherOption}
                label={t('admin:visits.inspection.columns.containerProtectionOther')}
                type="text"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormSelect
                className="mt-2"
                name="wasChemicallyTreated"
                label={t('admin:visits.inspection.columns.wasChemicallyTreated')}
                options={optionsData.wasChemicallyTreated}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
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
            className="mb-8i mt-8 w-full self-center"
            label={t('admin:visits.inspection.actionsPerfomed')}
          />

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FormMultipleSelect
                className="mt-2"
                name="eliminationMethodTypes"
                label={t('admin:visits.inspection.columns.eliminationMethodType')}
                options={optionsData.eliminationMethodTypes}
                required
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
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
            <div className="border-gray-300 h-32 w-32 flex-shrink-0 overflow-hidden rounded border">
              {photoPreviewUrl ? (
                <Link to={photoPreviewUrl} target="_blank" rel="noreferrer">
                  <img src={photoPreviewUrl} alt="" className="h-full w-full object-cover" />
                </Link>
              ) : (
                <div className="bg-gray-100 text-gray-500 flex h-full w-full items-center justify-center text-sm">
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
              <Button
                buttonType="large"
                label={t(isCreating ? 'admin:visits.inspection.create.action' : 'edit.action')}
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              />
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

const PreloadInspection = ({ inspection, handleClose, onSaved, visitId }: PreloadInspectionProps) => {
  const langContext = useLangContext();
  const { t } = useTranslation('admin');
  const isCreating = inspection === null;

  const [{ data, loading }] = useAxios(
    {
      url: isCreating ? '/questionnaires/current' : `/visits/${visitId}/inspections/${inspection.id}`,
      params: { language: langContext.state.selected },
    },
    { useCache: false },
  );

  const sourceData = useMemo(() => (data ? deserialize(data) : undefined), [data]);
  const inspectionData = isCreating ? undefined : (sourceData as InspectionData | undefined);

  const optionsData = useMemo<InspectionFormOptions | undefined>(() => {
    if (!sourceData) return undefined;

    if (isCreating) {
      const questionnaire = sourceData as QuestionnaireData;
      const questions = questionnaire.questions || [];

      const optionsFor = (...resourceNames: string[]): InspectionFormOption[] => {
        const question = questions.find(({ resourceName }) => resourceName && resourceNames.includes(resourceName));

        return (question?.options || []).flatMap((option) => {
          if (option.resourceId === undefined || option.resourceId === null) return [];

          return [
            {
              label: option.name,
              value: String(option.resourceId),
              isOther: option.optionType === 'textArea',
            },
          ];
        });
      };

      const valueOptionsFor = (resourceName: string): InspectionFormOption[] => {
        const question = questions.find((item) => item.resourceName === resourceName);

        return (question?.options || []).map((option) => ({
          label: option.name,
          value: option.name,
        }));
      };

      return {
        breadingSiteType: optionsFor('breeding_site_type_id'),
        containerProtections: optionsFor('container_protection_id', 'container_protection_ids'),
        eliminationMethodTypes: optionsFor('elimination_method_type_id', 'elimination_method_type_ids'),
        locations: [
          { label: t('visits.inspection.locations.house'), value: 'house' },
          { label: t('visits.inspection.locations.orchard'), value: 'orchard' },
        ],
        typeContents: optionsFor('type_content_id', 'type_content_ids'),
        wasChemicallyTreated: valueOptionsFor('was_chemically_treated'),
        waterSourceTypes: optionsFor('water_source_type_id', 'water_source_type_ids'),
      };
    }

    const existingInspection = sourceData as InspectionData;

    return {
      breadingSiteType: convertToFormSelectOptions(existingInspection.breadingSiteType),
      containerProtections: convertToFormSelectOptions(existingInspection.containerProtections),
      eliminationMethodTypes: convertToFormSelectOptions(existingInspection.eliminationMethodTypes),
      locations: convertToFormSelectOptions(existingInspection.locations || []),
      typeContents: convertToFormSelectOptions(existingInspection.typeContents),
      wasChemicallyTreated: convertToFormSelectOptions(
        existingInspection.wasChemicallyTreated,
        undefined,
        undefined,
        'value',
      ),
      waterSourceTypes: convertToFormSelectOptions(existingInspection.waterSourceTypes),
    };
  }, [isCreating, sourceData, t]);

  if (!sourceData || !optionsData || loading) {
    return <Loader />;
  }

  return (
    <EditInspectionDialog
      inspection={inspection}
      handleClose={handleClose}
      onSaved={onSaved}
      visitId={visitId}
      inspectionData={inspectionData}
      optionsData={optionsData}
    />
  );
};

export default PreloadInspection;
