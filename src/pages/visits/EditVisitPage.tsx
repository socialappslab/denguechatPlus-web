import { Box, Container, Dialog, Grid } from '@mui/material';

import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useAxios from 'axios-hooks';
import { deserialize, ExistingDocumentObject } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { capitalize } from 'lodash';
import GreenHouse from '@/assets/icons/house-green.svg';
import RedHouse from '@/assets/icons/house-red.svg';
import YellowHouse from '@/assets/icons/house-yellow.svg';
import useLangContext from '@/hooks/useLangContext';
import { FormSelectOption } from '@/schemas';
import { BaseEntity, Inspection, InspectionStatus, Visit } from '@/schemas/entities';
import FormSelect from '@/themed/form-select/FormSelect';
import Text from '@/themed/text/Text';
import { convertToFormSelectOptions, formatDateFromString } from '@/util';
import { Button } from '../../themed/button/Button';
import { FormInput } from '../../themed/form-input/FormInput';
import { Title } from '../../themed/title/Title';
import { HeadCell } from '@/themed/table/DataTable';
import FilteredDataTable from '@/components/list/FilteredDataTable';
import EditInspectionDialog from '@/components/dialog/EditInspectionDialog';

const renderColor = (color: InspectionStatus) => {
  return (
    <Box className="flex">
      <Box className={`w-5 h-5 bg-${color}-600 mr-3 rounded-full`} />
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
    render: (row) => {
      // i18n
      const answer = row.hasWater ? 'Sí' : 'No';
      return <p>{answer}</p>;
    },
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

const HouseStatusBanner = ({ color: colorPlain }: HouseStatusProps) => {
  const { t } = useTranslation('admin');
  const color = ColorMap[colorPlain as StatusPlain];
  return (
    <Box className="my-8 flex items-center">
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
  const { t } = useTranslation(['register', 'errorCodes', 'admin', 'translation']);
  const location = useLocation();
  const statefulAttr = location.state?.attributes;
  const langContext = useLangContext();
  const navigate = useNavigate();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(true);

  const rootElement = document.getElementById('root-app');
  // fetched from attributes (passed as state) update after endpoint
  const house = statefulAttr?.house;
  const status = statefulAttr?.visitStatus;
  const date = formatDateFromString(langContext.state.selected, visit.visitedAt);

  const [userOptions, setUserOptions] = useState<FormSelectOption[]>([]);

  const [{ data: usersData, loading: loadingUsers }] = useAxios<ExistingDocumentObject, unknown, ErrorResponse>({
    url: `/users?filter[roles][name]=brigadista&filter[team_id]=${(visit.team as BaseEntity)?.id}`,
  });

  useEffect(() => {
    if (!usersData) return;
    const deserializedData = deserialize(usersData);
    if (Array.isArray(deserializedData)) {
      const users = convertToFormSelectOptions(deserializedData, 'firstName', 'lastName');
      setUserOptions(users);
    }
  }, [usersData]);

  const methods = useForm({
    // resolver: zodResolver(updateCitySchema()),
    defaultValues: {
      site: house,
      date,
      brigadist: visit.brigadist ? String((visit?.brigadist as BaseEntity)?.id) : '',
      brigade: visit.team ? String((visit?.team as BaseEntity)?.name) : '',
      // i18n
      visitStartPlace: 'Huerta/Casa',
      visitPermission: visit.visitPermission ? 'Sí' : 'No',
      household: 'Adulto Mayor',
    },
  });

  const actions = (inspection: Inspection, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          onClick={() => {
            setSelectedInspection(inspection);
            setOpenEditDialog(true);
          }}
          disable
          label={t('translation:table.actions.edit')}
          buttonType="cell"
        />
      </div>
    );
  };

  const handleClose = () => setOpenEditDialog(false);

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
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
          noValidate
          autoComplete="off"
          className="w-full"
        >
          {/* // i8nk */}
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
          {/* // i18n */}
          <Title type="section" className="self-center mb-1" label={t('admin:visits.visitInformation')} />
          {/* i18n */}
          <Text type="menuItem" className="mb-2">
            {t('admin:visits.questionnaire')} 1.0.0
          </Text>

          <HouseStatusBanner color={status} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="site"
                // i18n
                label={t('admin:visits.inspection.siteNumber')}
                type="text"
                defaultValue={house}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="date"
                // i18n
                label={t('admin:visits.inspection.date')}
                type="text"
                // placeholder={t('edit.firstName_placeholder')}
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
              <FormInput
                className="mt-2 h-full"
                name="household"
                disabled
                label={t('admin:visits.inspection.household')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="visitNotes"
                label={t('admin:visits.inspection.notes')}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                disabled
                name="visitStartPlace"
                // i18n
                label={t('admin:visits.inspection.visitStart')}
                type="text"
                // placeholder={t('edit.firstName_placeholder')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                className="mt-2 h-full"
                name="visitPermission"
                // i18n
                label={t('admin:visits.inspection.visitPermission')}
                type="text"
                disabled
              />
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
      />

      <Dialog container={rootElement} fullWidth maxWidth="md" open={openEditDialog} onClose={handleClose}>
        <EditInspectionDialog
          visitId={visit.id as number}
          handleClose={() => setOpenEditDialog(false)}
          inspection={selectedInspection}
        />
      </Dialog>
    </Container>
  );
}

export default EditVisit;
