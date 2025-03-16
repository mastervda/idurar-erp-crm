const { readBySettingKey } = require('@/middlewares/settings');

const getLabel = (lang, key) => {
  try {
    if (!lang || typeof lang !== 'object') return 'No translation found';

    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang[lowerCaseKey]) return lang[lowerCaseKey];
    
    const label = lowerCaseKey
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return label;
  } catch (error) {
    console.error('Translation Error:', error);
    return 'No translate Found';
  }
};

const loadLanguageFile = (selectedLang) => {
  try {
    const langFilePath = path.resolve(__dirname, `./translation/${selectedLang}`);
    return require(langFilePath);
  } catch (error) {
    console.error(`❌ Error loading language file for: ${selectedLang}`, error);
    return {}; // Return an empty object if translation file is missing
  }
};

const useLanguage = (selectedLang = 'id_id') => {
  const lang = loadLanguageFile(selectedLang);

  return (key) => getLabel(lang, key);
};

module.exports = useLanguage;
