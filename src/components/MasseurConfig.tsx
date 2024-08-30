import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Masseur } from '../model/bookingTypes';
import PrimaryButton from './PrimaryButton';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';

const MasseurConfigWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const FieldLabel = styled.label`
  position: absolute;
  left: 10px;
  color: ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.background};
  transition: all 0.2s;
  pointer-events: none;
  padding: 0 4px;
  transform: translateY(-50%);
  top: -3px;
  font-size: 0.75em;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LanguageCheckbox = styled.input`
  cursor: pointer;
`;

const LanguagesWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  margin-bottom: 22px;
  font-size: 1em;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
`;

interface MasseurConfigProps {
  masseur: Masseur;
  onSave: (updatedMasseur: Partial<Masseur>) => void;
}

type LangMap = {
  [lang: string]: string;
}

const MasseurConfig: React.FC<MasseurConfigProps> = ({ masseur, onSave }) => {
  const { i18n, t } = useTranslation();

  const [currency, setCurrency] = useState(masseur.currency || '');
  const [location, setLocation] = useState<LangMap>(masseur.location 
    ? { "en": masseur.location } : {});
  const [description, setDescription] = useState<LangMap>(masseur.description
    ? { "en": masseur.description } : {});
  const [languages, setLanguages] = useState<string[]>(masseur.languages || ['en']);
  const [forceValidate, setForceValidate] = useState(false);

  // Set default languages based on i18n.language
  useEffect(() => {
    if (!languages.includes(i18n.language)) {
      setLanguages((prev) => {
        if (!prev.includes(i18n.language)) {
          return [...prev, i18n.language]
        }
        return prev;
    });
    }
  }, [i18n.language]);

  const allLanguages = ['en', 'nb', 'de', 'es'];

  useEffect(() => {
    if (currency.length === 0 && !masseur.currency) {
      if (i18n.language === 'nb') {
        setCurrency('NOK');
      } else {
        setCurrency('€');
      }
    }
  }, [masseur.currency]);

  const handleLanguageChange = (language: string) => {
    setLanguages((prev) => {
      if (prev.includes(language)) {
        if (prev.length > 1) {
          return prev.filter((lang) => lang !== language);
        }
        return prev;
      }
      return [...prev, language]
    });
  };

  const handleSave = () => {
    onSave({ currency, location: location["en"] || '', description: description["en"] || '', languages });
  };

  const validateCurrency = (str: string) => {
    if (str.length < 1) {
      return t('currency.cannot-be-empty.msg');
    }

    if (str.length > 3) {
      return t('currency.too-long.msg')
    }

    return '';
  }

  const validateLocation = (str: string) => {
    if (str.length > 60) {
      return t('location.too-long.msg');
    }
    return '';
  }

  const validateDescription = (str: string) => {
    if (str.length > 400) {
      return t('description.too-long.msg');
    }
    return '';
  }

  const langToDisplayString = {
    "en": t('english.lbl'),
    "nb": t('norwegian.lbl'),
    "de": t('german.lbl'),
    "es": t('spanish.lbl')
  };

  return (
    <MasseurConfigWrapper>
      <FloatingLabelInputWithError
        type="email"
        label={t('email_lbl')}
        value={masseur.email}
        isEditable={false}
      />
      <FloatingLabelInputWithError
        type="text"
        label={t('name_lbl')}
        value={masseur.name}
        isEditable={false}
      />
      <FloatingLabelInputWithError
        type="text"
        label={t('username_lbl')}
        value={masseur.username}
        isEditable={false}
        info={t('username.info')}
      />
      <FloatingLabelInputWithError
        type="text"
        label={t('currency.lbl')}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        validate={validateCurrency}
        forceValidate={forceValidate}
      />
      <LanguagesWrapper>
        <FieldLabel>{t('website-languages.lbl')}</FieldLabel>
        <CheckboxWrapper>
          {allLanguages.map((lang) => (
            <CheckboxLabel key={lang}>
              <LanguageCheckbox
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => handleLanguageChange(lang)}
              />
              {langToDisplayString[lang]}
            </CheckboxLabel>
          ))}
        </CheckboxWrapper>
      </LanguagesWrapper>
      {languages.map((lang) => (
        <>
          <FloatingLabelInputWithError
            type="text"
            label={t('location.lbl', { lang: langToDisplayString[lang] })}
            value={location[lang]}
            onChange={(e) => setLocation((prev: LangMap) => {
              return { ...prev, lang: e.target.value }
            })}
            validate={validateLocation}
            forceValidate={forceValidate}
            info={t('location.info')}
          />
          <FloatingLabelInputWithError
            type="text"
            label={t('description.lbl', { lang: langToDisplayString[lang] })}
            value={description[lang]}
            onChange={(e) => setDescription((prev: LangMap) => {
              return { ...prev, lang: e.target.value }
            })}
            validate={validateDescription}
            forceValidate={forceValidate}
          />
        </>
    ))}
      <PrimaryButton onClick={handleSave}>{t('save.act')}</PrimaryButton>
    </MasseurConfigWrapper>
  );
};

export default MasseurConfig;
