import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { HouseBlockType } from '@/schemas/entities';

export default function useHouseBlockTypeToLabel() {
  const { t } = useTranslation(['common']);

  const houseBlockTypeToLabel: Record<HouseBlockType, string> = useMemo(
    () => ({
      [HouseBlockType.FrenteAFrente]: 'Frente a Frente',
      [HouseBlockType.Block]: t('common:block'),
    }),
    [t],
  );

  const getHouseBlockTypeLabel = useCallback(
    (type: HouseBlockType) => houseBlockTypeToLabel[type] ?? type,
    [houseBlockTypeToLabel],
  );

  return { houseBlockTypeToLabel, getHouseBlockTypeLabel };
}
