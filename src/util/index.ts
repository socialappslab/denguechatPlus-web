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
  month: 'long', // Display full month name
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
