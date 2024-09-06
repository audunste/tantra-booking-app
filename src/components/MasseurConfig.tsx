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
  onSave: (updatedMasseur: Masseur) => void;
}

type LangMap = {
  [lang: string]: string;
}

const allLanguages = ['en', 'nb', 'de', 'es'];

const MasseurConfig: React.FC<MasseurConfigProps> = ({ masseur, onSave }) => {
  const { i18n, t } = useTranslation();

  const [forceValidate, setForceValidate] = useState(false);
  const [updatedMasseur, setUpdatedMasseur] = useState(masseur);

  const toggleLanguages = (langs) => {
    var newLanguages = updatedMasseur.languages;
    for (const lang of langs) {
      if (newLanguages.includes(lang)) {
        if (newLanguages.length > 1) {
          newLanguages = newLanguages.filter((l) => l !== lang);
        }
      } else {
        newLanguages.push(lang)
      }
    }
    const m = { ...updatedMasseur }
    m.languages = newLanguages
    for (const lang of newLanguages) {
      if (!m.translations[lang]) {
        m.translations[lang] = {}
      }
    }
    setUpdatedMasseur(m)
  }
 
  const toggleLanguage = (lang) => toggleLanguages([lang]);

  // Set default languages based on i18n.language
  useEffect(() => {
    if (masseur.languages.length === 0) {
      if ('en' === i18n.language || !allLanguages.includes(i18n.language)) {
        toggleLanguage('en');
      } else {
        toggleLanguages(['en', i18n.language])
      }
    }
  }, [i18n.language]);

  useEffect(() => {
    if (masseur.currency.length === 0) {
      if (i18n.language === 'nb') {
        setUpdatedMasseur({ ...updatedMasseur, currency: 'NOK' })
      } else {
        setUpdatedMasseur({ ...updatedMasseur, currency: '€' })
      }
    }
  }, [masseur.currency]);

  const handleSave = () => {
    onSave(updatedMasseur);
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

  const getTranslations = (lang: string) => updatedMasseur.translations[lang] || {}

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
        value={updatedMasseur.currency}
        onChange={(e) => setUpdatedMasseur({ ...updatedMasseur, currency: e.target.value })}
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
                checked={updatedMasseur.languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
              />
              {langToDisplayString[lang]}
            </CheckboxLabel>
          ))}
        </CheckboxWrapper>
      </LanguagesWrapper>
      {updatedMasseur.languages.map((lang) => (
        <FloatingLabelInputWithError
          key={"location-" + lang}
          type="text"
          label={t('location.lbl', { lang: langToDisplayString[lang] })}
          value={getTranslations(lang).location || ''}
          onChange={(e) => setUpdatedMasseur((prev: Masseur) => {
            const translations = prev.translations;
            translations[lang].location = e.target.value
            return { ...prev, translations }
          })}
          validate={validateLocation}
          forceValidate={forceValidate}
          info={t('location.info')}
        />
      ))}
      {updatedMasseur.languages.map((lang) => (
        <FloatingLabelInputWithError
          key={"description-" + lang}
          type="text"
          label={t('description.lbl', { lang: langToDisplayString[lang] })}
          value={getTranslations(lang).description || ''}
          onChange={(e) => setUpdatedMasseur((prev: Masseur) => {
            const translations = prev.translations;
            translations[lang].description = e.target.value
            return { ...prev, translations }
          })}
          validate={validateDescription}
          forceValidate={forceValidate}
        />
      ))}
      <PrimaryButton onClick={handleSave}>{t('save.act')}</PrimaryButton>
    </MasseurConfigWrapper>
  );
};

export default MasseurConfig;
