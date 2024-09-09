import React, { useState, useEffect } from 'react';
import { MassageType } from '../model/bookingTypes';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMasseur } from '../model/masseur';

const MassageTypeCreatorWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

interface MassageTypeProps {
  massageType?: MassageType;
  languages: string[];
  onSave: (massageType: MassageType) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const MassageTypeCreator: React.FC<MassageTypeProps> = ({
  massageType = null, languages, onSave, onCancel, onDelete = null
}) => {
  const [forceValidate, setForceValidate] = useState(false);
  const [updatedMassageType, setUpdatedMassageType] = useState<MassageType>(massageType || {
    id: '',
    masseurId: '',
    minutes: 0,
    cost: 0,
    addons: [],
    translations: {}
  })
  const masseur = useMasseur();

  const { i18n, t } = useTranslation();
  const langToDisplayString = {
    "en": t('english.lbl'),
    "nb": t('norwegian.lbl'),
    "de": t('german.lbl'),
    "es": t('spanish.lbl')
  };
  const getTranslations = (lang) => {
    return updatedMassageType.translations[lang] || {}
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setForceValidate(false);
    console.log("TODO add new massageType")
  };

  const handleInvalidSubmit = (e) => {
    e.preventDefault();
    setForceValidate(true);
  };

  const createInvalid = false;

/*
export interface MassageType {
  id: string;
  masseurId: string;
  minutes: number;
  cost: number;
  addons: Addon[];
  translations: Partial<Record<Langs, MassageTypeTranslation>>
}

export interface MassageTypeTranslation {
  name: string;
  shortDescription: string;
  description: string;
}
*/
  return (<MassageTypeCreatorWrapper>
    <form onSubmit={createInvalid ? handleInvalidSubmit : handleSubmit}>    
      {languages.map((lang) => (
        <FloatingLabelInputWithError
          key={updatedMassageType.id + "-name-" + lang}
          type="text"
          label={t('massage-name.lbl', { lang: langToDisplayString[lang] })}
          value={getTranslations(lang).name || ''}
          onChange={(e) => setUpdatedMassageType((prev: MassageType) => {
            const translations = prev.translations;
            if (!(lang in translations)) {
              translations[lang] = {}
            }
            translations[lang].name = e.target.value
            return { ...prev, translations }
          })}
          validate={v => ''}
          forceValidate={forceValidate}
        />
      ))}
      <FloatingLabelInputWithError
        key={updatedMassageType.id + "-minutes"}
        type="number"
        label={t('massage-minutes.lbl')}
        value={updatedMassageType.minutes}
        onChange={(e) => setUpdatedMassageType({ ...updatedMassageType, minutes: parseInt(e.target.value) })}
        validate={v => ''}
        forceValidate={forceValidate}
      />
      <FloatingLabelInputWithError
        key={updatedMassageType.id + "-cost"}
        type="number"
        label={t('massage-cost.lbl', { currency: masseur ? masseur.currency : '' })}
        value={updatedMassageType.cost}
        onChange={(e) => setUpdatedMassageType({ ...updatedMassageType, cost: parseInt(e.target.value) })}
        validate={v => ''}
        forceValidate={forceValidate}
      />
      {languages.map((lang) => (
        <FloatingLabelInputWithError
          key={updatedMassageType.id + "-shortDescription-" + lang}
          type="text"
          label={t('massage-short-description.lbl', { lang: langToDisplayString[lang] })}
          value={getTranslations(lang).shortDescription || ''}
          onChange={(e) => setUpdatedMassageType((prev: MassageType) => {
            const translations = prev.translations;
            if (!(lang in translations)) {
              translations[lang] = {}
            }
            translations[lang].shortDescription = e.target.value
            return { ...prev, translations }
          })}
          validate={v => ''}
          forceValidate={forceValidate}
        />
      ))}
      {languages.map((lang) => (
        <FloatingLabelInputWithError
          key={updatedMassageType.id + "-description-" + lang}
          type="text"
          label={t('massage-description.lbl', { lang: langToDisplayString[lang] })}
          value={getTranslations(lang).description || ''}
          onChange={(e) => setUpdatedMassageType((prev: MassageType) => {
            const translations = prev.translations;
            if (!(lang in translations)) {
              translations[lang] = {}
            }
            translations[lang].description = e.target.value
            return { ...prev, translations }
          })}
          validate={v => ''}
          forceValidate={forceValidate}
        />
      ))}
    </form>
  </MassageTypeCreatorWrapper>
  );
} 

export default MassageTypeCreator;