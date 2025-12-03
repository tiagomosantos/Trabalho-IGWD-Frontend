/**
 * Input Validation Utilities
 * Provides common validation functions for forms
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('A password é obrigatória');
    return { isValid: false, errors };
  }

  if (password.length < 6) {
    errors.push('A password deve ter pelo menos 6 caracteres');
  }

  if (password.length > 128) {
    errors.push('A password não pode ter mais de 128 caracteres');
  }

  // Optional: Add more strength requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('A password deve conter pelo menos uma letra maiúscula');
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push('A password deve conter pelo menos uma letra minúscula');
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('A password deve conter pelo menos um número');
  // }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate phone number (Portuguese format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  // Accepts formats like: 912345678, +351912345678, 912 345 678
  const phoneRegex = /^(\+351)?[0-9\s]{9,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validateUsername(username) {
  const errors = [];

  if (!username) {
    errors.push('O username é obrigatório');
    return { isValid: false, errors };
  }

  if (username.length < 3) {
    errors.push('O username deve ter pelo menos 3 caracteres');
  }

  if (username.length > 30) {
    errors.push('O username não pode ter mais de 30 caracteres');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('O username só pode conter letras, números e underscore');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate date of birth
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validateDateOfBirth(dateString) {
  const errors = [];

  if (!dateString) {
    errors.push('A data de nascimento é obrigatória');
    return { isValid: false, errors };
  }

  const date = new Date(dateString);
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();

  if (isNaN(date.getTime())) {
    errors.push('Data inválida');
  } else if (age < 0) {
    errors.push('Data de nascimento não pode ser no futuro');
  } else if (age < 16) {
    errors.push('Deves ter pelo menos 16 anos');
  } else if (age > 120) {
    errors.push('Data de nascimento inválida');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validateRequired(value, fieldName = 'Campo') {
  const errors = [];

  if (!value || (typeof value === 'string' && value.trim() === '')) {
    errors.push(`${fieldName} é obrigatório`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate form with multiple fields
 * @param {object} formData - Object with form field values
 * @param {object} rules - Object with validation rules for each field
 * @returns {object} - { isValid: boolean, errors: object }
 */
export function validateForm(formData, rules) {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    if (fieldRules.required) {
      const result = validateRequired(value, fieldRules.label || field);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
        return;
      }
    }

    if (fieldRules.email && value) {
      if (!isValidEmail(value)) {
        errors[field] = ['Email inválido'];
        isValid = false;
      }
    }

    if (fieldRules.password && value) {
      const result = validatePassword(value);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
    }

    if (fieldRules.phone && value) {
      if (!isValidPhone(value)) {
        errors[field] = ['Número de telefone inválido'];
        isValid = false;
      }
    }

    if (fieldRules.username && value) {
      const result = validateUsername(value);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
    }

    if (fieldRules.dateOfBirth && value) {
      const result = validateDateOfBirth(value);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
    }

    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = [`Deve ter pelo menos ${fieldRules.minLength} caracteres`];
      isValid = false;
    }

    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = [`Não pode ter mais de ${fieldRules.maxLength} caracteres`];
      isValid = false;
    }

    if (fieldRules.custom && value) {
      const result = fieldRules.custom(value);
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
    }
  });

  return {
    isValid,
    errors
  };
}
