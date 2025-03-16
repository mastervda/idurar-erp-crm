const getLabel = (key) => {
  try {
    if (!key || typeof key !== 'string') return 'No translation';

    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    // Convert missing key to a formatted label
    const formattedLabel = key
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Get existing translations from localStorage
    const storedLang = window.localStorage.getItem('lang');
    let langData = storedLang ? JSON.parse(storedLang) : {};

    if (!langData[lowerCaseKey]) {
      langData[lowerCaseKey] = formattedLabel;
      window.localStorage.setItem('lang', JSON.stringify(langData));
    }

    return formattedLabel;
  } catch (error) {
    console.error('🚨 Error getting label:', error);
    return 'No translate';
  }
};

const useLanguage = () => getLabel;

export default useLanguage;
