import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import { FormSelectOption } from '@/schemas';
import { HouseBlock } from '@/schemas/entities';
import { UpdateHouseBlock, UpdateHouseBlockInputType } from '@/schemas/update';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { convertToFormSelectOptions, extractAxiosErrorData } from '../../util';

export interface EditUserProps {
  user: IUser;
}

interface EditHouseBlockDialogProps {
  houseBlock: HouseBlock | null;
  handleClose: () => void;
  updateTable: () => void;
}

export function EditHouseBlockDialog({ houseBlock, handleClose, updateTable }: EditHouseBlockDialogProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'permissions', 'admin']);
  const { udpateMutation: updateRoleMutation } = useUpdateMutation<UpdateHouseBlock, HouseBlock>(
    `house_blocks/${houseBlock?.id}`,
  );

  const [sitesOptions, setSitesOptions] = useState<FormSelectOption[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const [{ data, loading }] = useAxios({
    url: `/houses/orphan_houses`,
  });

  useEffect(() => {
    if (!data) return;
    const deserializedData = deserialize(data);
    if (Array.isArray(deserializedData)) {
      const sites = convertToFormSelectOptions(deserializedData, 'referenceCode');
      setSitesOptions(sites);
    }
  }, [data]);

  const methods = useForm<UpdateHouseBlockInputType>({
    defaultValues: {
      houseIds: houseBlock?.houses.map((house) => ({ value: String(house.id), label: house.reference_code })),
      name: houseBlock?.name,
    },
  });

  const {
    handleSubmit,
    setError,
    // setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<UpdateHouseBlockInputType> = async (values) => {
    try {
      const { name, houseIds } = values;

      const payload: UpdateHouseBlock = {
        name,
        houseIds: houseIds.map((house) => parseInt(house.value, 10)),
      };
      await updateRoleMutation(payload);
      enqueueSnackbar(t('admin:roles.edit.success'), {
        variant: 'success',
      });
      updateTable();
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
    <div className="flex flex-col py-6 px-4">
      <FormProvider {...methods}>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          noValidate
          autoComplete="off"
          className="w-full p-8"
        >
          <Title type="section" className="self-center mb-8i w-full" label={t('admin:roles.create_role')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:house_block.form.name')}
                type="text"
                placeholder={t('admin:house_block.form.name_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormMultipleSelect
                name="houseIds"
                loading={loading}
                label={t('admin:house_block.form.sites')}
                placeholder={t('admin:house_block.form.sites_placeholder')}
                options={sitesOptions}
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
}

export default EditHouseBlockDialog;
