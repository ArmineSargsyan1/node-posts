export function isValidateData({ data, rules }) {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];


    if (rule.required) {
      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && !value.trim()) ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        errors[field] = `${field} is required`;
        return errors;
      }
    }

    if (
      rule.minLength &&
      typeof value === 'string' &&
      value.trim().length < rule.minLength
    ) {
      errors[field] = `${field} must be at least ${rule.minLength} characters long`;
      return errors;
    }

    if (rule.type) {
      let isValidType = true;

      switch (rule.type) {
        case 'array':
          isValidType = Array.isArray(value);
          break;
        case 'null':
          isValidType = value === null;
          break;
        default:
          isValidType = typeof value === rule.type;
      }

      if (!isValidType) {
        errors[field] = `${field} must be of type ${rule.type}`;
        return errors;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
}

export function validateFilters({filters, allowedKeys}) {
  if (!filters || typeof filters !== 'object') return [];
  return Object.keys(filters).filter(key => !allowedKeys.includes(key));
}
