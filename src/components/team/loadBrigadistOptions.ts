import { deserialize, type ExistingDocumentObject } from 'jsonapi-fractal';
import { authApi } from '@/api/axios';
import type { FormSelectOption, Member } from '@/schemas';

export type BrigadistOption = FormSelectOption & {
  name: string;
  team: { id: number; name: string } | null;
};

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
): Promise<BrigadistOption[]> {
  const pageSize = 500;
  const byId = new Map<string, BrigadistOption>();

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
        const { value, label: name } = toMemberOption(member);
        const team = member.team && String(member.team.id) !== String(currentTeamId) ? member.team : null;
        byId.set(value, { value, name, team, label: team ? `${name} (${team.name})` : name });
      }
      loaded += members.length;

      const total = Number(response.data.meta?.total);
      if (members.length < pageSize || (Number.isFinite(total) && loaded >= total)) break;
      page += 1;
    }
  }

  return [...byId.values()];
}

/** Selected people who are in another brigade and will be moved on save. */
export function findMembersToMove(selectedIds: string[], options: BrigadistOption[]): BrigadistOption[] {
  const byId = new Map(options.map((option) => [option.value, option]));
  return selectedIds.flatMap((id) => {
    const option = byId.get(id);
    return option?.team ? [option] : [];
  });
}
