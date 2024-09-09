import React, { useState, useEffect } from 'react';
import { MassageType } from '../model/bookingTypes';
import FloatingLabelInputWithError from './FloatingLabelInputWithError';
import { useTranslation } from 'react-i18next';

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

  return (<>
    {languages.map((lang) => (
      <FloatingLabelInputWithError
        key={updatedMassageType.id + "-name-" + lang}
        type="text"
        label={t('massage-name.lbl', { lang: langToDisplayString[lang] })}
        value={getTranslations(lang).name || ''}
        onChange={(e) => {}}
        validate={v => ''}
        forceValidate={forceValidate}
      />
    ))}
  </>
  );
} 

export default MassageTypeCreator;