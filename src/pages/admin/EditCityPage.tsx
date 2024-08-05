import { Box, Container, Grid } from '@mui/material';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { CityUpdate, UpdateCityInputType, updateCitySchema } from '@/schemas/update';
import useUpdateCity from '@/hooks/useUpdateCity';
import { City } from '../../schemas';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { extractAxiosErrorData } from '../../util';

export interface EditCityProps {
  city: City;
}

const DESTROY_FLAG = '_destroy';

export function EditCity({ city }: EditCityProps) {
  const { t } = useTranslation(['register', 'errorCodes', 'admin']);
  const navigate = useNavigate();

  const { udpateCityMutation, loading } = useUpdateCity(city.id.toString());
  const { enqueueSnackbar } = useSnackbar();
  const mappedNeighborhoods = city.neighborhoods.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {});

  const onGoBackHandler = () => {
    navigate('/admin/cities');
  };

  const methods = useForm<UpdateCityInputType>({
    resolver: zodResolver(updateCitySchema()),
    defaultValues:
      {
        name: city.name || '',
        neighborhoods: mappedNeighborhoods || [],
        newNeighborhoods: [],
      } || {},
  });

  const {
    handleSubmit,
    setError,
    setValue,
    watch,
    // formState: { isValid, errors },
  } = methods;

  const watchNeighborhoods = watch('neighborhoods', mappedNeighborhoods);
  const watchNew = watch('newNeighborhoods', []);

  const onRemoveNeighborhood = (id: string) => {
    const { [id]: tmp, ...rest } = watchNeighborhoods;
    setValue('neighborhoods', { [id]: DESTROY_FLAG, ...rest });
  };

  // New Neighborhoods
  const onAddNewNeighborhood = () => {
    setValue('newNeighborhoods', [...watchNew, '']);
  };

  const onRemoveNewNeighborhood = (id: number) => {
    watchNew.splice(id, 1);
    // only splice array when item is found
    setValue('newNeighborhoods', watchNew);
  };

  const convertSchemaToPayload = (data: UpdateCityInputType) => {
    const removeNeighborhoods = Object.keys(data.neighborhoods)
      .filter((id) => data.neighborhoods[id] === DESTROY_FLAG)
      .map((id) => ({ [DESTROY_FLAG]: id }));
    const editNeighborhoods = Object.keys(data.neighborhoods)
      .filter((id) => data.neighborhoods[id] !== DESTROY_FLAG)
      .map((id) => ({ id, name: data.neighborhoods[id] }));
    const addNeighborhoods = data.newNeighborhoods.map((name) => ({ name }));
    const payload = {
      name: data.name,
      neighborhoods_attributes: [...removeNeighborhoods, ...editNeighborhoods, ...addNeighborhoods],
    };
    return payload;
  };

  const onSubmitHandler: SubmitHandler<UpdateCityInputType> = async (values) => {
    try {
      const payload: CityUpdate = convertSchemaToPayload(values);

      await udpateCityMutation(payload);

      enqueueSnackbar(t('edit.success'), {
        variant: 'success',
      });

      onGoBackHandler();
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
        <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate autoComplete="off" className="w-full">
          <Title type="section" className="self-center mb-8" label={t('admin:cities.edit.edit_city')} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormInput
                className="mt-2 h-full"
                name="name"
                label={t('firstName')}
                type="text"
                placeholder={t('edit.firstName_placeholder')}
              />
            </Grid>

            {Object.keys(watchNeighborhoods).length !== 0 && (
              <Grid item xs={12} sm={12}>
                <Title type="subsection" label={t('admin:cities.edit.edit_current_neighborhoods')} />
              </Grid>
            )}

            {Object.keys(watchNeighborhoods).map((id) => {
              if (watchNeighborhoods[id] === DESTROY_FLAG)
                return (
                  <Grid item xs={12} sm={12} key={id}>
                    <Box className="flex flex-row items-center">
                      <FormInput
                        className="mt-2 h-full"
                        name={`neighborhoods[${id}]`}
                        label={t('admin:cities.edit.deleted')}
                        type="text"
                        placeholder={watchNeighborhoods[id]}
                        disabled
                      />
                    </Box>
                  </Grid>
                );
              return (
                <Grid item xs={12} sm={12} key={id}>
                  <Box className="flex flex-row items-center">
                    <FormInput
                      className="mt-2 h-full"
                      name={`neighborhoods[${id}]`}
                      label={watchNeighborhoods[id]}
                      type="text"
                      placeholder={watchNeighborhoods[id]}
                    />
                    <CancelIcon className="fill-gray ml-2 cursor-pointer" onClick={() => onRemoveNeighborhood(id)} />
                  </Box>
                </Grid>
              );
            })}

            <Grid item xs={12} sm={12}>
              <Title type="subsection" label={t('admin:cities.edit.add_new_neighborhoods')} />
            </Grid>
            {Object.keys(watchNew).map((id, idx) => {
              return (
                <Grid item xs={12} sm={12} key={id}>
                  <Box className="flex flex-row items-center">
                    <FormInput
                      className="mt-2 h-full"
                      name={`newNeighborhoods[${id}]`}
                      label={t('admin:cities.form.neighborhood')}
                      type="text"
                      placeholder={t('admin:cities.form.neighborhood_placeholder')}
                    />
                    <CancelIcon
                      className="fill-gray ml-2 cursor-pointer"
                      onClick={() => onRemoveNewNeighborhood(idx)}
                    />
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
                onClick={() => onAddNewNeighborhood()}
              />
            </Grid>
          </Grid>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-start md:gap-0">
            <div className="md:mr-2">
              <Button buttonType="large" label={t('edit.action')} disabled={loading} type="submit" />
            </div>

            <div>
              <Button
                buttonType="large"
                primary={false}
                disabled={loading}
                label={t('back')}
                onClick={onGoBackHandler}
              />
            </div>
          </div>
        </Box>
      </FormProvider>
    </Container>
  );
}

export default EditCity;
