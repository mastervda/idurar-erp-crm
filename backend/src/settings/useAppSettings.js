const useAppSettings = () => {
  let settings = {};
  settings['idurar_app_email'] = 'noreply@sapamoving.com';
  settings['idurar_base_url'] = 'https://internal.sapamoving.com';
  return settings;
};

module.exports = useAppSettings;
