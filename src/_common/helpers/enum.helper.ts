import { titleCase } from '@/_common/helpers/string.helper';
import { DropDownOption } from '@/_common/interfaces/dropdown.interface';

export const enumValuesAsArray = <T>(enumValue: T): string[] => {
  if (!enumValue) {
    return [];
  }
  return [...Object.values(enumValue)];
};

export const enumValuesExcept = <T>(
  enumObject: T,
  except: string,
): string[] => {
  return enumValuesAsArray(enumObject).filter((item) => item !== except);
};

export const selectFromEnum = <T>(theEnum: T, addEmpty = false) => {
  const selectOptions = [];

  addEmpty && selectOptions.push({ label: '--Select--', value: '' });

  for (const [key, value] of Object.entries(
    theEnum as unknown as ArrayLike<DropDownOption['value']>,
  )) {
    selectOptions.push({
      label: titleCase(key.replaceAll('_', ' ')),
      value,
    });
  }

  return [...selectOptions] as DropDownOption[];
};
