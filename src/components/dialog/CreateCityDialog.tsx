import { Box, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';

import CancelIcon from '@mui/icons-material/Cancel';
import { zodResolver } from '@hookform/resolvers/zod';
import useCreateMutation from '@/hooks/useCreateMutation';
import useStateContext from '@/hooks/useStateContext';
import { City } from '@/schemas';
import { CreateCity, CreateCityInputType, createCitySchema } from '@/schemas/create';
import { IUser } from '../../schemas/auth';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export interface EditUserProps {
  user: IUser;
}

interface CreateCityDialogProps {
  handleClose: () => void;
  updateTable: () => void;
}

export function CreateCityDialog({ handleClose, updateTable }: CreateCityDialogProps) {
  const { state } = useStateContext();
  const user = state.user as IUser;
  const { t } = useTranslation(['register', 'errorCodes', 'admin']);
  const { createMutation: createCityMutation } = useCreateMutation<CreateCity, City>(
    `admin/countries/1/states/${user.state.id}/cities/`,
  );

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<CreateCityInputType>({
    resolver: zodResolver(createCitySchema()),
    defaultValues: {
      neighborhoods: [''],
    },
  });

  const { handleSubmit, setError, setValue, watch } = methods;

  const watchNeighborhoods = watch('neighborhoods', ['']);

  const onRemoveNeighborhood = (id: number) => {
    watchNeighborhoods.splice(id, 1);
    // only splice array when item is found
    setValue('neighborhoods', watchNeighborhoods);
  };

  const onAddNeighborhood = () => {
    setValue('neighborhoods', [...watchNeighborhoods, '']);
  };

  const onSubmitHandler: SubmitHandler<CreateCityInputType> = async (values) => {
    try {
      const { name, neighborhoods } = values;

      const payload: CreateCity = {
        name,
        neighborhoodsAttributes: neighborhoods.map((neighborhood: string) => ({ name: neighborhood })),
      };
      await createCityMutation(payload);
      enqueueSnackbar(t('edit.success'), {
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
          enqueueSnackbar(t([`errorCodes:${error?.error_code}`, 'errorCodes:generic']), {
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
          <Title type="section" className="self-center mb-8i w-full" label={t('admin:cities.create_city')} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2"
                name="name"
                label={t('admin:cities.form.name')}
                type="text"
                placeholder={t('admin:cities.form.name_placeholder')}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Title type="subsection" label={t('admin:cities.neighborhoods')} />
            </Grid>
            {Object.keys(watchNeighborhoods).map((id, idx) => {
              return (
                <Grid item xs={12} sm={12} key={id}>
                  <Box className="flex flex-row items-center">
                    <FormInput
                      className=""
                      name={`neighborhoods.${id}`}
                      label={t('admin:cities.form.neighborhood')}
                      type="text"
                      placeholder={t('admin:cities.form.neighborhood_placeholder')}
                    />
                    <CancelIcon className="fill-gray ml-2 cursor-pointer" onClick={() => onRemoveNeighborhood(idx)} />
                  </Box>
                </Grid>
              );
            })}

            <Grid item>
              <Button
                primary={false}
                variant="outlined"
                className="justify-start text-md"
                label={t('admin:cities.form.add_button')}
                onClick={() => onAddNeighborhood()}
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

export default CreateCityDialog;
