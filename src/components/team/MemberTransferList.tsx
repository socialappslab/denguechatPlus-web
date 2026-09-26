import { ArrowBack, ArrowForward } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FormSelectOption } from '@/schemas';

interface MemberTransferListProps {
  options: FormSelectOption[];
  value: FormSelectOption[];
  onChange: (value: FormSelectOption[]) => void;
  loading: boolean;
}

interface MemberListProps {
  label: string;
  items: FormSelectOption[];
  checked: string[];
  onToggle: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  emptyMessage: string;
}

function MemberList({ label, items, checked, onToggle, search, onSearch, emptyMessage }: MemberListProps) {
  const { t } = useTranslation('admin');
  const checkedIds = new Set(checked);
  const visibleItems = items.filter((item) => item.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

  return (
    <Paper variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
      <Stack spacing={1.5} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          {label} ({items.length})
        </Typography>
        <TextField
          size="small"
          label={t('teams.edit.search_members')}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </Stack>
      <List dense sx={{ height: 360, overflowY: 'auto', py: 0 }} aria-label={label}>
        {visibleItems.length === 0 && (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            {emptyMessage}
          </Typography>
        )}
        {visibleItems.map((item) => (
          <ListItemButton key={item.value} onClick={() => onToggle(item.value)}>
            <Checkbox
              checked={checkedIds.has(item.value)}
              tabIndex={-1}
              disableRipple
              slotProps={{ input: { 'aria-label': item.label } }}
            />
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}

export default function MemberTransferList({ options, value, onChange, loading }: MemberTransferListProps) {
  const { t } = useTranslation('admin');
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');
  const [checkedAvailable, setCheckedAvailable] = useState<string[]>([]);
  const [checkedAssigned, setCheckedAssigned] = useState<string[]>([]);

  const assignedIds = new Set(value.map((item) => item.value));
  const checkedAvailableIds = new Set(checkedAvailable);
  const checkedAssignedIds = new Set(checkedAssigned);
  const available = options.filter((item) => !assignedIds.has(item.value));
  const sortByName = (a: FormSelectOption, b: FormSelectOption) => a.label.localeCompare(b.label);
  const assigned = [...value].sort(sortByName);

  const toggle = (ids: string[], setIds: (ids: string[]) => void, id: string) => {
    setIds(ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]);
  };

  const add = () => {
    onChange([...value, ...available.filter((item) => checkedAvailableIds.has(item.value))]);
    setCheckedAvailable([]);
  };

  const remove = () => {
    onChange(value.filter((item) => !checkedAssignedIds.has(item.value)));
    setCheckedAssigned([]);
  };

  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', gap: 2, alignItems: 'center' }}
    >
      <MemberList
        label={t('teams.edit.available')}
        items={available}
        checked={checkedAvailable}
        onToggle={(id) => toggle(checkedAvailable, setCheckedAvailable, id)}
        search={availableSearch}
        onSearch={setAvailableSearch}
        emptyMessage={loading ? t('teams.edit.loading_members') : t('teams.edit.no_available')}
      />
      <Stack spacing={1}>
        <Button
          variant="outlined"
          onClick={add}
          disabled={checkedAvailable.length === 0}
          aria-label={t('teams.edit.add_selected')}
        >
          <ArrowForward />
        </Button>
        <Button
          variant="outlined"
          onClick={remove}
          disabled={checkedAssigned.length === 0}
          aria-label={t('teams.edit.remove_selected')}
        >
          <ArrowBack />
        </Button>
      </Stack>
      <MemberList
        label={t('teams.edit.assigned')}
        items={assigned}
        checked={checkedAssigned}
        onToggle={(id) => toggle(checkedAssigned, setCheckedAssigned, id)}
        search={assignedSearch}
        onSearch={setAssignedSearch}
        emptyMessage={t('teams.edit.no_assigned')}
      />
    </Box>
  );
}
