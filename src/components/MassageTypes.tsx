import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MassageType } from '../model/bookingTypes';
import PrimaryButton from './PrimaryButton';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import MassageTypeCreator from './MassageTypeCreator';

const MassageTypesWrapper = styled.div`
  width: 100%;
  max-width: 502px;
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: ${(props) => props.theme.dimens.gap}px;
`;

const FieldLabel = styled.label`
  position: absolute;
  left: 8px;
  color: ${(props) => props.theme.colors.borderText};
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

interface MassageTypesProps {
  massageTypes: MassageType[];
  languages: string[],
  onSave: (updatedMassageTypes: MassageType[]) => void;
}

type LangMap = {
  [lang: string]: string;
}

const allLanguages = ['en', 'nb', 'de', 'es'];

const MassageTypes: React.FC<MassageTypesProps> = ({ massageTypes, languages, onSave }) => {
  const { i18n, t } = useTranslation();

  const [forceValidate, setForceValidate] = useState(false);
  const [updatedMassageTypes, setUpdatedMassageTypes] = useState(massageTypes);
  const [isMakingNewWindow, setMakingNewWindow] = useState(massageTypes.length == 0);
  const [windowBeingEdited, setWindowBeingEdited] = useState(null);

  const handleSave = () => {
    onSave(updatedMassageTypes);
  };

  const langToDisplayString = {
    "en": t('english.lbl'),
    "nb": t('norwegian.lbl'),
    "de": t('german.lbl'),
    "es": t('spanish.lbl')
  };

  const getTranslations = (massageType: MassageType, lang) => {
    return massageType.translations[lang] || {}
  }

  return (
    <MassageTypesWrapper>
      {updatedMassageTypes.map((massageType: MassageType) => {
        return (<>{languages.map((lang) => (
          <FloatingLabelInputWithError
            key={massageType.id + "-name-" + lang}
            type="text"
            label={t('massage-name.lbl', { lang: langToDisplayString[lang] })}
            value={getTranslations(massageType, lang).name || ''}
            onChange={(e) => setUpdatedMassageTypes((prev: MassageType[]) => {
              return prev;
            })}
            validate={v => ''}
            forceValidate={forceValidate}
          />
        ))}</>)
      })}
      {isMakingNewWindow && <MassageTypeCreator
        languages={languages}
        onSave={() => {}}
        onCancel={() => {}}
      />}
    </MassageTypesWrapper>
  );
};

export default MassageTypes;
