import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, CircularProgress, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import * as z from 'zod';
import { authApi } from '@/api/axios';
import MemberTransferList from '@/components/team/MemberTransferList';
import { TEAMS_UPDATE } from '@/constants/permissions';
import useUpdateMutation from '@/hooks/useUpdateMutation';
import useUser from '@/hooks/useUser';
import type { FormSelectOption, Member } from '@/schemas';
import type { Team } from '@/schemas/entities';
import type { UpdateTeam } from '@/schemas/update';
import Button from '@/themed/button/Button';
import FormInput from '@/themed/form-input/FormInput';
import FormMultipleSelect from '@/themed/form-multiple-select/FormMultipleSelect';
import Title from '@/themed/title/Title';
import { extractAxiosErrorData } from '@/util';
import AppErrorPage from '../AppErrorPage';

interface TeamDetails {
  id: string | number;
  name: string;
  members: Member[];
}

const toOption = (member: Member): FormSelectOption => ({
  value: String(member.id),
  label: member.fullName || `${member.firstName} ${member.lastName}`.trim(),
});

async function loadAvailableMembers(signal: AbortSignal): Promise<FormSelectOption[]> {
  const pageSize = 500;
  const byId = new Map<string, FormSelectOption>();

  for (const roleName of ['brigadista', 'facilitador']) {
    let page = 1;
    let loaded = 0;

    while (true) {
      const response = await authApi.get<ExistingDocumentObject>('/users', {
        signal,
        params: {
          'filter[role_name]': roleName,
          'filter[without_team]': true,
          'page[number]': page,
          'page[size]': pageSize,
          sort: 'user_profiles.first_name',
          order: 'asc',
        },
      });
      const members = deserialize<Member>(response.data);
      if (!Array.isArray(members)) throw new Error('Expected a list of available members');
      for (const member of members) {
        const option = toOption(member);
        byId.set(option.value, option);
      }
      loaded += members.length;

      const total = Number(response.data.meta?.total);
      if (members.length < pageSize || (Number.isFinite(total) && loaded >= total)) break;
      page += 1;
    }
  }

  return [...byId.values()];
}

interface TeamMembersFormProps {
  team: TeamDetails;
  available: FormSelectOption[];
  availableLoading: boolean;
  availableError: boolean;
}

function TeamMembersForm({ team, available, availableLoading, availableError }: TeamMembersFormProps) {
  const { t } = useTranslation(['admin', 'validation', 'errorCodes', 'register']);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { udpateMutation, loading: saving } = useUpdateMutation<UpdateTeam, Team>(`teams/${team.id}`);
  const schema = z.object({
    name: z.string().trim().min(1, t('validation:requiredField.name')),
    members: z.array(z.object({ label: z.string(), value: z.string() })).min(1, t('validation:required')),
  });
  type FormValues = z.infer<typeof schema>;
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: team.name, members: team.members.map(toOption) },
  });
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isDirty },
  } = methods;
  const members = useWatch({ control, name: 'members' });
  const selectedOptions = members ?? [];
  const optionsById = new Map<string, FormSelectOption>();
  for (const option of [...team.members.map(toOption), ...available, ...selectedOptions]) {
    optionsById.set(option.value, option);
  }
  const options = [...optionsById.values()].sort((a, b) => a.label.localeCompare(b.label));

  const save = handleSubmit(async ({ name, members: selectedMembers }) => {
    try {
      await udpateMutation({ team: { name, memberIds: selectedMembers.map((member) => member.value) } });
      enqueueSnackbar(t('admin:teams.edit.success'), { variant: 'success' });
      navigate('/admin/teams');
    } catch (error) {
      const errorData = extractAxiosErrorData(error);
      const firstError = errorData?.errors?.[0];
      const message = firstError?.detail || t('errorCodes:generic');
      if (firstError?.field === 'name') setError('name', { type: 'server', message });
      if (firstError?.field === 'member_ids') setError('members', { type: 'server', message });
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  return (
    <Container
      maxWidth={false}
      className="bg-background"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
    >
      <FormProvider {...methods}>
        <Box component="form" onSubmit={save} noValidate autoComplete="off" className="w-full max-w-6xl">
          <Title type="section" className="mb-8 self-center" label={t('admin:teams.edit.edit_page')} />
          <FormInput
            className="mt-2"
            name="name"
            label={t('admin:teams.form.name')}
            type="text"
            placeholder={t('admin:teams.form.name_placeholder')}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('admin:teams.edit.members_heading')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {t('admin:teams.edit.available_hint')}
            </Typography>
            {availableError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {t('admin:teams.edit.load_error')}
              </Alert>
            )}
            {isDesktop ? (
              <MemberTransferList
                options={options}
                value={selectedOptions}
                loading={availableLoading}
                onChange={(next) => setValue('members', next, { shouldDirty: true, shouldValidate: true })}
              />
            ) : (
              <FormMultipleSelect
                name="members"
                label={t('admin:teams.form.members')}
                placeholder={t('admin:teams.form.members_placeholder')}
                options={options}
                loading={availableLoading}
              />
            )}
            {isDesktop && errors.members && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.members.message}
              </Typography>
            )}
          </Box>

          <div className="mt-8 grid grid-cols-1 gap-4 md:flex md:justify-start md:gap-0">
            <div className="md:mr-2">
              <Button
                buttonType="large"
                type="submit"
                label={t('admin:teams.edit.save')}
                disabled={saving || !isDirty}
              />
            </div>
            <div>
              <Button
                buttonType="large"
                primary={false}
                disabled={saving}
                label={t('register:back')}
                onClick={() => navigate('/admin/teams')}
              />
            </div>
          </div>
        </Box>
      </FormProvider>
    </Container>
  );
}

export default function TeamMembersPage() {
  const { id } = useParams();
  const { t } = useTranslation(['admin', 'translation']);
  const user = useUser();
  const canUpdate = user?.permissions?.includes(TEAMS_UPDATE) ?? false;
  const teamQuery = useQuery({
    queryKey: ['team', id],
    enabled: Boolean(id) && canUpdate,
    queryFn: async ({ signal }) => {
      const response = await authApi.get<ExistingDocumentObject>(`/teams/${id}`, { signal });
      const team = deserialize<TeamDetails>(response.data);
      if (Array.isArray(team) || !team) throw new Error('Expected a brigade');
      return team;
    },
  });
  const availableQuery = useQuery({
    queryKey: ['team', id, 'available-members'],
    enabled: Boolean(id) && canUpdate,
    queryFn: ({ signal }) => loadAvailableMembers(signal),
  });

  if (!canUpdate) return <AppErrorPage message={t('translation:errors.unauthorized')} />;
  if (teamQuery.isPending) return <CircularProgress sx={{ m: 4 }} />;
  if (teamQuery.isError) return <AppErrorPage message={t('admin:teams.edit.load_team_error')} />;

  return (
    <TeamMembersForm
      team={teamQuery.data}
      available={availableQuery.data ?? []}
      availableLoading={availableQuery.isPending}
      availableError={availableQuery.isError}
    />
  );
}
