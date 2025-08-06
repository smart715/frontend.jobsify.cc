
// Flag data for countries with their currencies and languages
export const countryData = {
  // North America
  US: {
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    language: 'English'
  },
  CA: {
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    language: 'English'
  },
  MX: {
    name: 'Mexico',
    flag: '🇲🇽',
    currency: 'MXN',
    language: 'Spanish'
  },

  // Europe
  GB: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    language: 'English'
  },
  DE: {
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    language: 'German'
  },
  FR: {
    name: 'France',
    flag: '🇫🇷',
    currency: 'EUR',
    language: 'French'
  },
  ES: {
    name: 'Spain',
    flag: '🇪🇸',
    currency: 'EUR',
    language: 'Spanish'
  },
  IT: {
    name: 'Italy',
    flag: '🇮🇹',
    currency: 'EUR',
    language: 'Italian'
  },
  NL: {
    name: 'Netherlands',
    flag: '🇳🇱',
    currency: 'EUR',
    language: 'Dutch'
  },
  CH: {
    name: 'Switzerland',
    flag: '🇨🇭',
    currency: 'CHF',
    language: 'German'
  },
  SE: {
    name: 'Sweden',
    flag: '🇸🇪',
    currency: 'SEK',
    language: 'Swedish'
  },
  NO: {
    name: 'Norway',
    flag: '🇳🇴',
    currency: 'NOK',
    language: 'Norwegian'
  },
  DK: {
    name: 'Denmark',
    flag: '🇩🇰',
    currency: 'DKK',
    language: 'Danish'
  },

  // Asia Pacific
  JP: {
    name: 'Japan',
    flag: '🇯🇵',
    currency: 'JPY',
    language: 'Japanese'
  },
  CN: {
    name: 'China',
    flag: '🇨🇳',
    currency: 'CNY',
    language: 'Chinese'
  },
  KR: {
    name: 'South Korea',
    flag: '🇰🇷',
    currency: 'KRW',
    language: 'Korean'
  },
  IN: {
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    language: 'Hindi'
  },
  AU: {
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    language: 'English'
  },
  NZ: {
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    language: 'English'
  },
  SG: {
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    language: 'English'
  },
  MY: {
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    language: 'Malay'
  },
  TH: {
    name: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB',
    language: 'Thai'
  },
  PH: {
    name: 'Philippines',
    flag: '🇵🇭',
    currency: 'PHP',
    language: 'Filipino'
  },
  ID: {
    name: 'Indonesia',
    flag: '🇮🇩',
    currency: 'IDR',
    language: 'Indonesian'
  },
  VN: {
    name: 'Vietnam',
    flag: '🇻🇳',
    currency: 'VND',
    language: 'Vietnamese'
  },

  // Middle East & Africa
  AE: {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    language: 'Arabic'
  },
  SA: {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    language: 'Arabic'
  },
  ZA: {
    name: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    language: 'English'
  },
  EG: {
    name: 'Egypt',
    flag: '🇪🇬',
    currency: 'EGP',
    language: 'Arabic'
  },
  IL: {
    name: 'Israel',
    flag: '🇮🇱',
    currency: 'ILS',
    language: 'Hebrew'
  },
  TR: {
    name: 'Turkey',
    flag: '🇹🇷',
    currency: 'TRY',
    language: 'Turkish'
  },

  // South America
  BR: {
    name: 'Brazil',
    flag: '🇧🇷',
    currency: 'BRL',
    language: 'Portuguese'
  },
  AR: {
    name: 'Argentina',
    flag: '🇦🇷',
    currency: 'ARS',
    language: 'Spanish'
  },
  CL: {
    name: 'Chile',
    flag: '🇨🇱',
    currency: 'CLP',
    language: 'Spanish'
  },
  CO: {
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    language: 'Spanish'
  },
  PE: {
    name: 'Peru',
    flag: '🇵🇪',
    currency: 'PEN',
    language: 'Spanish'
  }
};

// Get unique currencies with their associated flags
export const getCurrencyOptions = () => {
  const currencies = new Map();
  
  Object.entries(countryData).forEach(([code, data]) => {
    if (!currencies.has(data.currency)) {
      currencies.set(data.currency, {
        code: data.currency,
        flag: data.flag,
        country: data.name
      });
    }
  });

  return Array.from(currencies.values()).sort((a, b) => a.code.localeCompare(b.code));
};

// Get unique languages with their associated flags
export const getLanguageOptions = () => {
  const languages = new Map();
  
  Object.entries(countryData).forEach(([code, data]) => {
    if (!languages.has(data.language)) {
      languages.set(data.language, {
        name: data.language,
        flag: data.flag,
        country: data.name
      });
    }
  });

  return Array.from(languages.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// Get country by currency
export const getCountryByCurrency = (currency) => {
  return Object.entries(countryData).find(([code, data]) => data.currency === currency);
};

// Get country by language
export const getCountryByLanguage = (language) => {
  return Object.entries(countryData).find(([code, data]) => data.language === language);
};
