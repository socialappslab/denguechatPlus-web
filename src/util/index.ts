import { AxiosError } from 'axios';
import { ZodError, ZodType, z } from 'zod';
import { ErrorResponse, FormSelectOption, State } from '../schemas';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getProperty(obj: any, propertyString: string): any {
  if (!obj) {
    return undefined;
  }
  const properties = propertyString.split('.');
  let result = obj;

  // eslint-disable-next-line no-restricted-syntax
  for (const property of properties) {
    result = result[property];
    if (result === undefined) {
      // Property doesn't exist, handle the error or return a default value
      return undefined;
    }
  }

  return result;
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  month: 'short', // Display month in short format
  day: 'numeric', // Display day of the month
  year: 'numeric', // Display full year
};

export const formatDateFromString = (locale: string, date: string | null | undefined) => {
  if (!date) {
    return '-';
  }

  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, dateFormatOptions);
};

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

// Function to extract error information from an Axios error
export function extractAxiosErrorData(error: unknown): ErrorResponse | null {
  if (error !== null && typeof error === 'object') {
    if ('isAxiosError' in error && (error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === 'object' &&
        'errors' in axiosError.response.data
      ) {
        return axiosError.response.data as ErrorResponse;
      }
      return null;
    }
  }
  return null;
}

export // Function to create FormSelectOption array for cities
function createCityOptions(states: State[]): FormSelectOption[] {
  return states.flatMap((state) =>
    state.cities.map((city) => ({
      label: city.name,
      value: String(city.id),
    })),
  );
}

// Function to create FormSelectOption array for neighborhoods based on selected city ID
export function createNeighborhoodOptions(states: State[], selectedCityId: number | string): FormSelectOption[] {
  const selectedCity = states
    .flatMap((state) => state.cities)
    .find((city) => String(city.id) === String(selectedCityId));

  return (
    selectedCity?.neighborhoods.map((neighborhood) => ({
      label: neighborhood.name,
      value: String(neighborhood.id),
    })) || []
  );
}

export function convertToFormSelectOptions(data: Array<{ id: string; name: string }>): FormSelectOption[] {
  return data.map((item) => ({
    label: item.name,
    value: item.id,
  }));
}

export const findOptionByName = (options: FormSelectOption[], name: string): FormSelectOption | undefined => {
  return options.find((option) => option.label.toLowerCase() === name.toLowerCase());
};

export const constructFilterObject = (
  filter: { [key: string]: string },
  filterOptions?: string[],
): { [key: string]: string } => {
  if (Object.keys(filter).length === 0) {
    return {};
  }

  const result: { [key: string]: string } = {};
  Object.entries(filter).forEach(([key, value]) => {
    if (filterOptions?.find((option) => option === key)) {
      result[`filter[${key}][]`] = value;
    } else {
      result[`filter[${key}]`] = value;
    }
  });
  return result;
};

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly cause: ZodError,
  ) {
    super(message);
  }
}

export const validation = <T extends ZodType>(schema: T, data: unknown, errorMessage?: string): z.infer<T> => {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  throw new ValidationError(errorMessage ?? 'Validation error', result.error);
};
