import React, { useState } from "react";
import { MassageType, Masseur } from "../model/bookingTypes"
import { useMasseur } from "../model/masseur";
import { useMassageTypes } from "../model/massageTypes";
import { useUser } from "../model/user";
import { User } from "firebase/auth";
import { editMasseur } from "../model/firestoreService";
import { Heading2, Heading3 } from "./Heading";
import MasseurConfig from "./MasseurConfig";
import SecondaryButton from "./SecondaryButton";
import FixedSpace from "./FixedSpace";
import MassageTypes from "./MassageTypes";
import { useTranslation } from "react-i18next";


enum DisplayState {
  ShowEditProfileButton,
  ShowEditBasicInfoOrMassageTypes,
  ShowBasicInfoEditing,
  ShowMassageTypesEditing,
  ShowNothing
}

const Profile: React.FC = ({

}) => {
  const { t } = useTranslation();

  const [isEditingProfile, setEditingProfile] = useState(false);
  const [isEditingMasseur, setEditingMasseur] = useState(false);
  const [isEditingMassageTypes, setEditingMassageTypes] = useState(false);
  
  const user: User = useUser();
  const masseur: Masseur = useMasseur(user ? user.uid : null);
  const massageTypes: MassageType[] = useMassageTypes(user ? user.uid : null);

  const handleSaveMassseur = (updatedMasseur: Masseur) => {
    console.log("Save updatedMasseur: ", updatedMasseur);
    editMasseur(updatedMasseur);
    setEditingMasseur(false);
  }

  const displayState = user
    ? (!masseur.currency || isEditingMasseur
      ? DisplayState.ShowBasicInfoEditing
      : (massageTypes.length == 0 || isEditingMassageTypes
        ? DisplayState.ShowMassageTypesEditing
        : (isEditingProfile
          ? DisplayState.ShowEditBasicInfoOrMassageTypes
          : DisplayState.ShowEditProfileButton
        )
      )
    )
    : DisplayState.ShowNothing;

  return (
    <>
      {displayState == DisplayState.ShowBasicInfoEditing && (<>
        <Heading3>{t('basic-info.title')}</Heading3>
        <MasseurConfig masseur={masseur} onSave={handleSaveMassseur} />
      </>)}
      {displayState == DisplayState.ShowMassageTypesEditing && (<>
        <Heading3>{t('massage-types.title')}</Heading3>
        <MassageTypes massageTypes={massageTypes} languages={masseur.languages} onDone={() => setEditingMassageTypes(false)} />
      </>)}
      {displayState == DisplayState.ShowEditBasicInfoOrMassageTypes && (<>
        <SecondaryButton onClick={() => setEditingMasseur(true)}>
          {t('edit-basic-info.act')}
        </SecondaryButton>
        <SecondaryButton onClick={() => setEditingMassageTypes(true)}>
          {t('edit-massage-types.act')}
        </SecondaryButton>
        <SecondaryButton onClick={() => setEditingProfile(false)}>
          {t('cancel.act')}
        </SecondaryButton>
      </>)}
      {displayState == DisplayState.ShowEditProfileButton && (
        <SecondaryButton onClick={() => setEditingProfile(true)}>
          {t('edit-profile.act')}
        </SecondaryButton>
      )}
      <FixedSpace height={10} />
    </>
  )
}

export default Profile;