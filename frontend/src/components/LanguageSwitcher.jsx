import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-outline-secondary btn-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: '6px 12px'
        }}
        onClick={(e) => {
          e.currentTarget.nextElementSibling.classList.toggle('show');
        }}
        title="Change language"
      >
        <Globe className="icon-sm" />
        <span>{currentLanguage.code.toUpperCase()}</span>
      </button>
      <div
        className="language-dropdown"
        onClick={(e) => e.currentTarget.classList.remove('show')}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage(lang.code)}
          >
            <span style={{ fontSize: '18px', marginRight: '8px' }}>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
