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
  font-weight: bold;
  margin-bottom: 8px;
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

interface MasseurConfigProps {
  masseur: Masseur;
  onSave: (updatedMasseur: Partial<Masseur>) => void;
}

const MasseurConfig: React.FC<MasseurConfigProps> = ({ masseur, onSave }) => {
  const { i18n, t } = useTranslation();

  const [currency, setCurrency] = useState(masseur.currency || '');
  const [location, setLocation] = useState(masseur.location || '');
  const [description, setDescription] = useState(masseur.description || '');
  const [languages, setLanguages] = useState<string[]>(masseur.languages || ['en']);
  const [forceValidate, setForceValidate] = useState(false);

  // Set default languages based on i18n.language
  useEffect(() => {
    if (!languages.includes(i18n.language)) {
      setLanguages((prev) => [...prev, i18n.language]);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (currency.length === 0 && !masseur.currency) {
      if (i18n.language === 'nb') {
        setCurrency('NOK');
      } else {
        setCurrency('€');
      }
    }
    if (!languages.includes(i18n.language)) {
      setLanguages((prev) => [...prev, i18n.language]);
    }
  }, [masseur.currency]);

  const handleLanguageChange = (language: string) => {
    setLanguages((prev) =>
      prev.includes(language) ? prev.filter((lang) => lang !== language) : [...prev, language]
    );
  };

  const handleSave = () => {
    onSave({ currency, location, description, languages });
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
      <FloatingLabelInputWithError
        type="text"
        label={t('location.lbl')}
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        validate={validateLocation}
        forceValidate={forceValidate}
        info={t('location.info')}
      />
      <FloatingLabelInputWithError
        type="text"
        label={t('description.lbl')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        validate={validateDescription}
        forceValidate={forceValidate}
      />
      <div>
        <FieldLabel>Languages:</FieldLabel>
        <CheckboxWrapper>
          {['en', 'nb', 'de', 'es'].map((lang) => (
            <CheckboxLabel key={lang}>
              <LanguageCheckbox
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => handleLanguageChange(lang)}
              />
              {lang.toUpperCase()}
            </CheckboxLabel>
          ))}
        </CheckboxWrapper>
      </div>
      <PrimaryButton onClick={handleSave}>{t('save.act')}</PrimaryButton>
    </MasseurConfigWrapper>
  );
};

export default MasseurConfig;
