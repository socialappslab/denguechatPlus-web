import { Box, Grid } from '@mui/material';

import { FormProvider, useForm } from 'react-hook-form';

import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Inspection } from '@/schemas/entities';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';

interface EditInspectionDialogProps {
  inspection: Inspection | null;
  visitId: number;
  handleClose: () => void;
}

const EditInspectionDialog = ({ inspection, handleClose, visitId }: EditInspectionDialogProps) => {
  const { t } = useTranslation(['register', 'admin']);
  // const [inspectionData, setInspectionData] = useState<Inspection | undefined>();

  const [{ data, loading, error }] = useAxios({
    url: `/visits/${visitId}/inspections/${inspection?.id}`,
  });

  useEffect(() => {
    console.log(data, visitId, inspection?.id);
    if (data) {
      const deserializedData = deserialize(data);
      if (!Array.isArray(deserializedData)) {
        // eslint-disable-next-line no-console
        console.log('deserializedData load user', deserializedData);
      }
    }
  }, [data]);

  const methods = useForm({
    defaultValues: {
      breadingSiteType: inspection?.breadingSiteType,
      containerProtection: inspection?.containerProtection,
      containerProtectionOther: inspection?.containerProtectionOther,
      eliminationMethodType: inspection?.eliminationMethodType,
      eliminationMethodTypeOther: inspection?.eliminationMethodTypeOther,
      hasWater: inspection?.hasWater,
      status: t(`admin:visits.status.${inspection?.status}`),
      typeContents: inspection?.typeContents,
      wasChemicallyTreated: inspection?.wasChemicallyTreated,
      waterSourceType: inspection?.waterSourceType,
      waterSourceOther: inspection?.waterSourceOther,
    },
  });

  const { handleSubmit } = methods;

  const onSubmitHandler = () => {};

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
              <FormInput
                className="mt-2"
                name="breadingSiteType"
                label={t('admin:visits.inspection.columns.breadingSiteType')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="eliminationMethodType"
                label={t('admin:visits.inspection.columns.eliminationMethodType')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="typeContents"
                label={t('admin:visits.inspection.columns.typeContents')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
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
              <FormInput
                className="mt-2"
                name="waterSourceType"
                label={t('admin:visits.inspection.columns.waterSourceType')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2"
                name="hasWater"
                label={t('admin:visits.inspection.columns.hasWater')}
                type="text"
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
              <FormInput
                className="mt-2"
                name="containerProtection"
                label={t('admin:visits.inspection.columns.containerProtection')}
                type="text"
                placeholder={t('admin:roles.form.name_placeholder')}
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

export default EditInspectionDialog;
