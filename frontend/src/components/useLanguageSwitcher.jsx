import { useTranslation } from 'react-i18next';

const useLanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return {
    t,
    changeLanguage,
  };
};

export default useLanguageSwitcher;
