import React, { useState, useEffect } from 'react';
import { MassageType } from '../model/bookingTypes';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMasseur } from '../model/masseur';
import FloatingLabelChoice, { Option } from './FloatingLabelChoice';
import { massagePresets } from '../model/massagePresets';
import FloatingLabelTextareaWithError from './FloatingLabelTextareaWithError';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';

const MassageTypeCreatorWrapper = styled.div`
  width: 100%;
  max-width: 502px;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const ButtonContainer = styled.div`
  background-color: inherit;
  display: flex;
  margin: 0px 3px;
  gap: ${(props) => props.theme.dimens.gap}px;
  flex-grow: 1; /* Ensures the inputs take up the full width */
  width: 100%;
`;

const ButtonWrapper = styled.div`
  flex: 1;
  width: 100%;
`

const minLengths = {
  name: 5,
  shortDescription: 20,
  description: 50
};

const maxLengths = {
  name: 60,
  shortDescription: 120,
  description: 1000
};

interface MassageTypeProps {
  massageType?: MassageType;
  languages: string[];
  onSave: (massageType: MassageType) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

function normalizeDescription(input: string): string {
  let result = input.replace(/[ \t]+/g, ' '); // Collapse spaces and tabs to single space
  result = result.replace(/ ?\n ?/g, '\n'); // Remove spaces before and after newlines
  result = result.replace(/([^\n])\n([^\n])/g, '$1 $2'); // Replace single newlines with spaces between words
  return result.trim();
}

const MassageTypeCreator: React.FC<MassageTypeProps> = ({
  massageType = null, languages, onSave, onCancel = null, onDelete = null
}) => {
  const [forceValidate, setForceValidate] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Option | null>(null); // Track selected preset
  const [updatedMassageType, setUpdatedMassageType] = useState<MassageType>(massageType || {
    id: '',
    masseurId: '',
    minutes: 0,
    cost: NaN,
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
    onSave(updatedMassageType);
  };

  const handleInvalidSubmit = (e) => {
    e.preventDefault();
    setForceValidate(true);
  };

  const validateName = (name) => {
    if (!name || name.length < 3) {
      return t('min-length.msg', { minLength: minLengths.name });
    }
    if (name.length > maxLengths.name) {
      return t('max-length.msg', { maxLengths: maxLengths.name });
    }
    return '';
  }

  const validateShortDescription = (value) => {
    if (!value || value.length < minLengths.shortDescription) {
      return t('min-length.msg', { minLength: minLengths.shortDescription });
    }
    if (value.length > maxLengths.shortDescription) {
      return t('max-length.msg', { maxLengths: maxLengths.shortDescription });
    }
    return '';
  }

  const validateDescription = (value) => {
    if (!value || value.length < minLengths.description) {
      return t('min-length.msg', { minLength: minLengths.description });
    }
    if (value.length > maxLengths.description) {
      return t('max-length.msg', { maxLengths: maxLengths.description });
    }
    return '';
  }

  const validateMinutes = (value) => {
    if (!Number.isInteger(value)) {
      return t('minutes.must-be-number.msg');
    }
    const minutes = parseInt(value);
    if (minutes < 15) {
      return t('minutes.minimum.msg');
    }
    if (minutes > 180) {
      return t('minutes.maximum.msg');
    }
    return '';
  }

  const validateCost = (value) => {
    if (!Number.isInteger(value)) {
      return t('cost.must-be-number.msg');
    }
    const cost = parseInt(value);
    if (cost < 0) {
      return t('cost.minimum.msg');
    }
    if (cost > 100000) {
      return t('cost.maximum.msg');
    }
    return '';
  }

  const createInvalid = languages.map(lang => {
    const translation = getTranslations(lang);
    var errorMsg: string = '';
    errorMsg = validateName(translation.name);
    if (errorMsg.length > 0) {
      return errorMsg;
    }
    errorMsg = validateShortDescription(translation.shortDescription);
    if (errorMsg.length > 0) {
      return errorMsg;
    }
    errorMsg = validateDescription(translation.description);
    if (errorMsg.length > 0) {
      return errorMsg;
    }
    return errorMsg;
  }).reduce((acc: boolean, value: string) => {
    return !!acc || !!value;
  }, false)
  || validateMinutes(updatedMassageType.minutes)
  || validateCost(updatedMassageType.cost);

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

  const applyPreset = (option: Option) => {
    const preset = massagePresets[option.value];
    if (!preset) {
      setSelectedPreset(null);
      return;
    }
    setUpdatedMassageType((prev: MassageType) => {
      const retval = { ...prev }
      for (const lang of Object.keys(preset.translations)) {
        const translation = preset.translations[lang];
        retval.translations[lang] = {
          description: normalizeDescription(translation.description),
          name: translation.name,
          shortDescription: translation.shortDescription
        }
      }
      retval.minutes = preset.minutes
      return retval
    })    
    setSelectedPreset(option);
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
          onChange={(value) => applyPreset(value)}
          info="You can select one of these preset to fill in values that you then can edit to your liking."
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
              setSelectedPreset(null);
              return { ...prev, translations }
            })}
            validate={v => validateName(v)}
            forceValidate={forceValidate}
            maxLength={maxLengths.name}
          />
        ))}
        <FloatingLabelInputWithError
          key={updatedMassageType.id + "-minutes"}
          type="number"
          label={t('massage-minutes.lbl')}
          value={updatedMassageType.minutes}
          onChange={(e) => setUpdatedMassageType({ ...updatedMassageType, minutes: parseInt(e.target.value) })}
          validate={v => validateMinutes(v)}
          forceValidate={forceValidate}
        />
        <FloatingLabelInputWithError
          key={updatedMassageType.id + "-cost"}
          type="number"
          label={t('massage-cost.lbl', { currency: masseur ? masseur.currency : '' })}
          value={updatedMassageType.cost}
          onChange={(e) => {
            console.log("cost: ", e.target.value)
            setUpdatedMassageType({ ...updatedMassageType, cost: parseInt(e.target.value) })
          }}
          validate={v => validateCost(v)}
          forceValidate={forceValidate}
        />
        {languages.map((lang) => (
          <FloatingLabelTextareaWithError
            key={updatedMassageType.id + "-shortDescription-" + lang}
            label={t('massage-short-description.lbl', { lang: langToDisplayString[lang] })}
            value={getTranslations(lang).shortDescription || ''}
            onChange={(e) => setUpdatedMassageType((prev: MassageType) => {
              const translations = prev.translations;
              if (!(lang in translations)) {
                translations[lang] = {}
              }
              translations[lang].shortDescription = e.target.value
              setSelectedPreset(null);
              return { ...prev, translations }
            })}
            validate={v => validateShortDescription(v)}
            forceValidate={forceValidate}
            rows={2}
            maxLength={maxLengths.shortDescription}
          />
        ))}
        {languages.map((lang) => (
          <FloatingLabelTextareaWithError
            key={updatedMassageType.id + "-description-" + lang}
            label={t('massage-description.lbl', { lang: langToDisplayString[lang] })}
            value={getTranslations(lang).description || ''}
            onChange={(e) => setUpdatedMassageType((prev: MassageType) => {
              const translations = prev.translations;
              if (!(lang in translations)) {
                translations[lang] = {}
              }
              translations[lang].description = e.target.value
              setSelectedPreset(null);
              return { ...prev, translations }
            })}
            validate={v => validateDescription(v)}
            forceValidate={forceValidate}
            rows={6}
            maxLength={maxLengths.description}
          />
        ))}
        <ButtonContainer>
          {onCancel && <ButtonWrapper><SecondaryButton $fill type="button" onClick={onCancel}>{t('cancel.act')}</SecondaryButton></ButtonWrapper>}
          <ButtonWrapper><PrimaryButton $fill type="submit">{t('save.act')}</PrimaryButton></ButtonWrapper>
        </ButtonContainer>
      </form>
    </MassageTypeCreatorWrapper>
  );
} 

export default MassageTypeCreator;
