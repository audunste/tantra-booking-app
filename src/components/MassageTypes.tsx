import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MassageType } from '../model/bookingTypes';
import PrimaryButton from './PrimaryButton';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import MassageTypeCreator from './MassageTypeCreator';
import FixedSpace from './FixedSpace';
import { createMassageType } from '../model/firestoreService';
import RowWithLabelAndButton from './RowWithLabelAndButton';
import { FiEdit } from 'react-icons/fi';

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

  const handleSaveMassageType = (mt: MassageType) => {
    if (!mt.id || !mt.masseurId) {
      createMassageType(mt);
      setMakingNewWindow(false);
    }
  }

  const massageTypeToLabel = (massageType: MassageType) => {
    var lang = i18n.language;
    if (!(lang in massageType.translations)) {
      if ('en' in massageType.translations) {
        lang = 'en';
      } else {
        lang = Object.keys(massageType.translations)[0];
      }
    }
    return massageType.translations[lang].name + ', ' + t('minutes.lbl', { minutes: massageType.minutes });
  }

  return (
    <MassageTypesWrapper>
      {updatedMassageTypes.map((massageType: MassageType) => {
        return (<RowWithLabelAndButton
          key={massageType.id}
          label={massageTypeToLabel(massageType)}
          buttonContent={isMakingNewWindow ? null : <FiEdit size={18} style={{ verticalAlign: 'middle' }} />}
          onButtonClick={() => {}}
          hoverButton
          borderlessButton
        />)
      })}
      {massageTypes.length == 0 && (<>
        <div>{t('first-massage-type.msg')}</div>
        <FixedSpace height={8} />
      </>)}
      {isMakingNewWindow && <MassageTypeCreator
        languages={languages}
        onSave={handleSaveMassageType}
        onCancel={massageTypes.length == 0 ? undefined : () => {}}
      />}
    </MassageTypesWrapper>
  );
};

export default MassageTypes;
