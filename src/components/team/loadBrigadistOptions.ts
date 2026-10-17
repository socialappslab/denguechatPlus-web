import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { authApi } from '@/api/axios';
import type { FormSelectOption, Member } from '@/schemas';

export const toMemberOption = (member: Member): FormSelectOption => ({
  value: String(member.id),
  label: member.fullName || `${member.firstName} ${member.lastName}`.trim(),
});

/**
 * Lists every brigadist and facilitator, including those already in a brigade,
 * so they can be moved. The API reassigns them when the brigade is saved.
 */
export async function loadBrigadistOptions(
  signal: AbortSignal,
  currentTeamId?: string | number,
): Promise<FormSelectOption[]> {
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
          'page[number]': page,
          'page[size]': pageSize,
          sort: 'user_profiles.first_name',
          order: 'asc',
        },
      });
      const members = deserialize<Member>(response.data);
      if (!Array.isArray(members)) throw new Error('Expected a list of available members');
      for (const member of members) {
        const option = toMemberOption(member);
        const team = member.team;
        if (team && String(team.id) !== String(currentTeamId)) option.label = `${option.label} (${team.name})`;
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
