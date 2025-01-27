import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSelectOption } from '@/schemas';
import { BaseEntity, Inspection, InspectionSelectable } from '@/schemas/entities';
import FormSelect from '@/themed/form-select/FormSelect';
import Loader from '@/themed/loader/Loader';
import { convertToFormSelectOptions, extractAxiosErrorData } from '@/util';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import { enqueueSnackbar } from 'notistack';
import { UpdateInspection } from '@/schemas/update';

interface EditInspectionDialogProps {
  inspection: Inspection | null;
  visitId: number;
  handleClose: () => void;
  inspectionData?: Record<keyof InspectionSelectable, ({ selected: boolean } & BaseEntity)[]>;
}

type InspectionFormOptions = Record<keyof InspectionSelectable, FormSelectOption[]>;

const EditInspectionDialog = ({ inspection, handleClose, inspectionData, visitId }: EditInspectionDialogProps) => {
  const { t } = useTranslation(['register', 'admin']);
  // const [inspectionData, setInspectionData] = useState<Inspection | undefined>();
  const [optionsData, setOptionsData] = useState<InspectionFormOptions>({
    breadingSiteType: [{ value: '', label: '' }],
    containerProtection: [{ value: '', label: '' }],
    eliminationMethodType: [{ value: '', label: '' }],
    typeContents: [{ value: '', label: '' }],
    wasChemicallyTreated: [{ value: '', label: '' }],
    waterSourceType: [{ value: '', label: '' }],
  });

  useEffect(() => {
    if (!inspectionData) return;
    const optionsDataTemp: InspectionFormOptions = {
      breadingSiteType: convertToFormSelectOptions(inspectionData.breadingSiteType),
      containerProtection: convertToFormSelectOptions(inspectionData.containerProtection),
      eliminationMethodType: convertToFormSelectOptions(inspectionData.eliminationMethodType),
      typeContents: convertToFormSelectOptions(inspectionData.typeContents),
      wasChemicallyTreated: convertToFormSelectOptions(inspectionData.wasChemicallyTreated),
      waterSourceType: convertToFormSelectOptions(inspectionData.waterSourceType),
    };

    setOptionsData(optionsDataTemp);
  }, [inspectionData]);

  const extractIdFromInspections = (values?: ({ selected: boolean } & BaseEntity)[]) => {
    if (!values) return null;
    return values
      .filter((i) => i.selected)
      .map((i) => i.id)
      .pop()
      ?.toString();
  };

  const methods = useForm({
    defaultValues: {
      breadingSiteType: extractIdFromInspections(inspectionData?.breadingSiteType) || '',
      containerProtection: extractIdFromInspections(inspectionData?.containerProtection) || '',
      eliminationMethodType: extractIdFromInspections(inspectionData?.eliminationMethodType) || '',
      typeContents: extractIdFromInspections(inspectionData?.typeContents) || '',
      wasChemicallyTreated: extractIdFromInspections(inspectionData?.wasChemicallyTreated) || '',
      waterSourceType: extractIdFromInspections(inspectionData?.waterSourceType) || '',
      containerProtectionOther: inspection?.containerProtectionOther,
      eliminationMethodTypeOther: inspection?.eliminationMethodTypeOther,
      hasWater: t(`admin:visits.water.${inspection?.hasWater}`),
      status: t(`admin:visits.status.${inspection?.status}`),
      waterSourceOther: inspection?.waterSourceOther,
    },
  });

  const { handleSubmit, watch, setError } = methods;

  const { udpateMutation: updateInspectionMutation } = useUpdateMutation<UpdateInspection, Inspection>(
    `visits/${visitId}/inspections/${inspection?.id}`,
  );

  const convertSchemaToPayload = (values: Inspection): UpdateInspection => {
    return {
      breeding_site_type_id: values.breadingSiteType,
      container_protection_id: values.containerProtection,
      water_source_type_id: values.waterSourceType,
      elimination_method_type_id: values.eliminationMethodType,
      water_source_other: values.waterSourceOther,
      was_chemically_treated: values.wasChemicallyTreated,
    };
  };

  const onSubmitHandler: SubmitHandler<Inspection> = async (values) => {
    try {
      // const payload: UpdateVisit = convertSchemaToPayload(values);

      await updateInspectionMutation(convertSchemaToPayload(values));

      enqueueSnackbar(t('admin:cities.edit.success'), {
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
    }
  };

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
          <Title type="section" className="self-center mb-8i w-full" label="Contenedor Tipo:" />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="breadingSiteType"
                label={t('admin:visits.inspection.columns.breadingSiteType')}
                options={optionsData.breadingSiteType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="eliminationMethodType"
                label={t('admin:visits.inspection.columns.eliminationMethodType')}
                options={optionsData.eliminationMethodType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="typeContents"
                label={t('admin:visits.inspection.columns.typeContents')}
                options={optionsData.typeContents}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="status"
                label={t('admin:visits.inspection.columns.status')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="waterSourceType"
                label={t('admin:visits.inspection.columns.waterSourceType')}
                options={optionsData.waterSourceType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="hasWater"
                label={t('admin:visits.inspection.columns.hasWater')}
                type="text"
                disabled
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="waterSourceTypeOther"
                label={t('admin:visits.inspection.columns.waterSourceTypeOther')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="containerLocation"
                label="Ubicación del contenedor"
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid> */}
          </Grid>

          <Title type="section" className="self-center mb-8i w-full mt-8" label="Contenedor Tipo:" />

          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="name"
                label="Tipo de tapa"
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="name"
                label="Otro tipo de tapa"
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormSelect
                className="mt-2"
                name="containerProtection"
                label={t('admin:visits.inspection.columns.containerProtection')}
                options={optionsData.containerProtection}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="containerProtectionOther"
                label={t('admin:visits.inspection.columns.containerProtectionOther')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="wasChemicallyTreated"
                label={t('admin:visits.inspection.columns.wasChemicallyTreated')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="eliminationMethodTypeOther"
                label={t('admin:visits.inspection.columns.eliminationMethodTypeOther')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-end md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={false} type="submit" />
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

const PreloadInspection = ({ inspection, handleClose, visitId }: EditInspectionDialogProps) => {
  const [inspectionData, setInspectionData] =
    useState<Record<keyof InspectionSelectable, ({ selected: boolean } & BaseEntity)[]>>();
  const [{ data, loading, error }] = useAxios({
    url: `/visits/${visitId}/inspections/${inspection?.id}`,
  });

  useEffect(() => {
    if (data) {
      const deserializedData = deserialize(data) as Record<
        keyof InspectionSelectable,
        ({ selected: boolean } & BaseEntity)[]
      >;

      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
      }

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
    />
  );
};

export default PreloadInspection;
