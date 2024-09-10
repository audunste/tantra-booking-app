import React, { useState, useEffect } from 'react';
import { MassageType } from '../model/bookingTypes';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMasseur } from '../model/masseur';
import FloatingLabelChoice, { Option } from './FloatingLabelChoice';

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

// Sample presets
const massagePresets: Record<string, Partial<MassageType>> = {
  relaxation: {
    minutes: 45,
    translations: {
      en: { 
        name: 'Relaxation Massage', 
        shortDescription: 'TODO', 
        description: 'TODO multi paragraph description here' 
      }
    }
  },
  deep_tissue: {
    minutes: 60,
    translations: {
      en: { 
        name: 'Deep Tissue Massage', 
        shortDescription: 'TODO', 
        description: 'TODO multi paragraph description here' 
      }
    }
  },
  tantric: {
    minutes: 75,
    translations: {
      en: { 
        name: 'Tantric Massage',
        shortDescription: 'TODO', 
        description: 'TODO multi paragraph description here' 
      }
    }
  },
}


const MassageTypeCreator: React.FC<MassageTypeProps> = ({
  massageType = null, languages, onSave, onCancel, onDelete = null
}) => {
  const [forceValidate, setForceValidate] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Option | null>(null); // Track selected preset
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

  const handlePresetSelect = (option: Option) => {
    const preset = massagePresets[option.value];
    if (preset) {
      setUpdatedMassageType({ ...updatedMassageType, ...preset });
    }
    setSelectedPreset(option);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setForceValidate(false);
    console.log("TODO add new massageType");
    onSave(updatedMassageType);
  };

  const handleInvalidSubmit = (e) => {
    e.preventDefault();
    setForceValidate(true);
  };

  const createInvalid = false;

  const presetToOption = (presetKey: string) => {
    const preset = massagePresets[presetKey];
    if (!preset) {
      return {
        label: "Preset not found",
        value: presetKey
      }
    }
    var lang = i18n.language;
    if (!(lang in preset.translations)) {
      if ('en' in preset.translations) {
        lang = 'en';
      } else {
        lang = Object.keys(preset.translations)[0];
      }
    }
    return {
      label: preset.translations[lang].name,
      value: presetKey
    }
  }

  return (
    <MassageTypeCreatorWrapper>
      <form onSubmit={createInvalid ? handleInvalidSubmit : handleSubmit}>
        {/* Preset Selector */}
        <FloatingLabelChoice
          label="Preset or Custom Massage"
          placeholder="Custom Massage"
          value={selectedPreset}
          options={Object.keys(massagePresets).map(p => presetToOption(p))}
          onChange={(value) => setSelectedPreset(value)}
          info="Choose your preferred massage type from the options."
        />

        {/* Name, Minutes, Cost, Translations */}
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
        <button type="submit">{t('save.lbl')}</button>
        <button type="button" onClick={onCancel}>{t('cancel.lbl')}</button>
      </form>
    </MassageTypeCreatorWrapper>
  );
} 

export default MassageTypeCreator;
