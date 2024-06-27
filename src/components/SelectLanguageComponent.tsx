import { MenuItem, Select, Input as _Input } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useMemo, useState } from 'react';

import i18next from 'i18next';
import { COLORS, DISPATCH_ACTIONS } from '../constants';
import useLangContext from '../hooks/useLangContext';
import { LANGUAGES } from '../i18n/config';
import { FormSelectOption } from '../themed/form-select/FormSelect';

export const InputSelectSmall = styled(_Input)`
  background-color: white;
  padding: 6px 9px;
  font-size: 14px;
  border-width: 1px;
  border-style: solid;
  border-color: ${COLORS.fieldBorder};
  border-radius: 4px;
  & input {
    padding-top: 4px;
    padding-bottom: 5px;
  }
`;

const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
  const displayName = new Intl.DisplayNames([displayLocale || locale], {
    type: 'language',
  }).of(locale)!;
  return displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1);
};

function SelectLanguageComponent() {
  const { i18n } = useTranslation();
  const { resolvedLanguage: currentLanguage } = i18n;

  const langContext = useLangContext();
  const [value, setValue] = useState<string | undefined>(currentLanguage);

  const languages = useMemo(() => {
    return LANGUAGES.map((locale) => ({
      locale,
      name: getLocaleDisplayName(locale),
    }));
  }, []);

  const options: FormSelectOption[] = useMemo(() => {
    return LANGUAGES.map((locale) => ({
      label: getLocaleDisplayName(locale),
      value: locale,
    }));
  }, []);

  const onChange = (valueSelected: string) => {
    setValue(valueSelected);
    const selected = languages.find((option) => option.locale === valueSelected);
    if (!selected) return;
    i18next.changeLanguage(selected.locale);
    langContext.dispatch({ type: DISPATCH_ACTIONS.SET_LANG, payload: valueSelected });
  };

  return (
    <Select
      disableUnderline
      input={<InputSelectSmall />}
      value={value}
      onChange={(e) => {
        if (e.target.value) {
          onChange(e.target.value);
        }
      }}
    >
      {options.map((option) => (
        <MenuItem key={`key-${option.value}`} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SelectLanguageComponent;
