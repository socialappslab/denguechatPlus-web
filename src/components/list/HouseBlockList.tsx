import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/themed/button/Button';
import { HouseBlock } from '../../schemas/entities';
import { HeadCell } from '../../themed/table/DataTable';
import { EditHouseBlockDialog } from '../dialog/EditHouseBlockDialog';
import FilteredDataTable from './FilteredDataTable';

const HouseBlockDataTable = FilteredDataTable<HouseBlock>;

export default function HouseBlockList() {
  const { t } = useTranslation('translation');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHouseBlock, setSelectedHouseBlock] = useState<HouseBlock | null>(null);
  const [updateControl, setUpdateControl] = useState(0);

  const headCells: HeadCell<HouseBlock>[] = [
    {
      id: 'id',
      label: 'id',
      sortable: true,
    },
    {
      id: 'name',
      label: 'house_block',
      render: (row) => (
        <p>
          {t('columns.house_block')} {row.name}
        </p>
      ),
      filterable: true,
      sortable: true,
    },
    {
      id: 'wedge',
      label: 'wedge',
      render: (row) => (
        <p>
          {row.wedge.name}
        </p>
      ),
      filterable: true,
      sortable: true,
    },
  ];

  const rootElement = document.getElementById('root-app');

  const handleClose = () => setOpenDialog(false);

  const updateTable = () => {
    setUpdateControl((prev) => prev + 1);
  };

  const onEdit = (row: HouseBlock) => {
    setOpenDialog(true);
    setSelectedHouseBlock(row);
  };

  const actions = (row: HouseBlock, loading?: boolean) => {
    return (
      <div className="flex flex-row">
        <Button
          primary
          disabled={loading}
          label={t('table.actions.edit')}
          buttonType="cell"
          onClick={() => onEdit(row)}
        />
      </div>
    );
  };

  return (
    <>
      {/* Edit */}
      <Dialog container={rootElement} fullWidth maxWidth="sm" open={openDialog} onClose={handleClose}>
        <EditHouseBlockDialog
          handleClose={() => setOpenDialog(false)}
          updateTable={updateTable}
          houseBlock={selectedHouseBlock}
        />
      </Dialog>

      {/* Table */}
      <HouseBlockDataTable
        endpoint="house_blocks"
        defaultFilter="name"
        headCells={headCells}
        updateControl={updateControl}
        title={t('menu.house_blocks')}
        subtitle={t('menu.descriptions.house_blocks')}
        actions={actions}
      />
    </>
  );
}
