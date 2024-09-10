import { MassageType } from "./bookingTypes";



export const massagePresets: Record<string, Partial<MassageType>> = {
  relaxation: {
    minutes: 45,
    translations: {
      en: { 
        name: 'Relaxation Massage', 
        shortDescription: 'A soothing massage aimed at relieving stress and promoting relaxation.',
        description: `A Relaxation Massage is designed to relieve tension and stress, offering a calming experience for both the mind and body. 
        The therapist uses gentle techniques, such as long, flowing strokes, to reduce muscle stiffness and help improve circulation. 

        This massage is perfect for those looking to unwind, improve mood, and restore a sense of calm. 
        It is particularly helpful for stress management and enhancing overall well-being, without intense pressure or discomfort.` 
      },
      nb: { 
        name: 'Avspenningsmassasje', 
        shortDescription: 'En beroligende massasje for å lindre stress og fremme avslapning.',
        description: `Avspenningsmassasje er designet for å lindre spenning og stress, og gir en beroligende opplevelse for både kropp og sinn. 
        Terapeuten bruker skånsomme teknikker som lange, flytende strøk for å redusere muskelstivhet og forbedre sirkulasjonen. 

        Denne massasjen er perfekt for de som ønsker å slappe av, forbedre humøret og gjenopprette ro. 
        Den er spesielt nyttig for stresshåndtering og for å fremme generell velvære uten intens trykk eller ubehag.` 
      },
      de: { 
        name: 'Entspannungsmassage', 
        shortDescription: 'Eine beruhigende Massage zur Stressreduktion und Entspannung.',
        description: `Die Entspannungsmassage zielt darauf ab, Spannung und Stress zu lindern und bietet eine beruhigende Erfahrung für Körper und Geist. 
        Der Masseur verwendet sanfte Techniken, wie lange, fließende Bewegungen, um Muskelsteifheit zu reduzieren und die Durchblutung zu verbessern. 

        Diese Massage ist ideal für Menschen, die sich entspannen, die Stimmung verbessern und ein Gefühl der Ruhe wiederherstellen möchten. 
        Sie hilft besonders beim Stressabbau und fördert das allgemeine Wohlbefinden, ohne intensiven Druck oder Unbehagen.` 
      },
      es: { 
        name: 'Masaje de Relajación', 
        shortDescription: 'Un masaje calmante para aliviar el estrés y promover la relajación.',
        description: `El masaje de relajación está diseñado para aliviar la tensión y el estrés, proporcionando una experiencia calmante para la mente y el cuerpo. 
        El terapeuta utiliza técnicas suaves, como movimientos largos y fluidos, para reducir la rigidez muscular y mejorar la circulación. 

        Este masaje es perfecto para aquellos que buscan relajarse, mejorar el estado de ánimo y restaurar una sensación de calma. 
        Es particularmente útil para el manejo del estrés y para mejorar el bienestar general, sin presión intensa ni incomodidad.` 
      }
    }
  },
  deep_tissue: {
    minutes: 60,
    translations: {
      en: { 
        name: 'Deep Tissue Massage', 
        shortDescription: 'A therapeutic massage targeting deeper layers of muscle tissue to alleviate chronic pain.',
        description: `A Deep Tissue Massage focuses on realigning deeper layers of muscles and connective tissue, particularly effective for chronic aches and pains. 
        This type of massage is used for treating stiff necks, lower back pain, tight muscles, and sore shoulders. 

        Using slower strokes and deeper pressure, the therapist works to break down knots and adhesions in the muscle tissue. 
        This massage is ideal for individuals who prefer stronger pressure and are looking for relief from tight, painful muscles.` 
      },
      nb: { 
        name: 'Dypvevsmassasje', 
        shortDescription: 'En terapeutisk massasje rettet mot dypere muskelvev for å lindre kroniske smerter.',
        description: `Dypvevsmassasje fokuserer på å justere dypere muskellag og bindevev, og er spesielt effektiv for kroniske smerter og plager. 
        Denne typen massasje brukes for å behandle stive nakker, smerter i korsryggen, stramme muskler og ømme skuldre. 

        Ved å bruke langsommere strøk og dypere trykk jobber terapeuten med å bryte ned knuter og bindevevsadhesjoner. 
        Denne massasjen er ideell for personer som foretrekker sterkere trykk og søker lindring fra stramme, smertefulle muskler.` 
      },
      de: { 
        name: 'Tiefengewebsmassage', 
        shortDescription: 'Eine therapeutische Massage zur Linderung chronischer Schmerzen durch tiefes Eindringen in das Muskelgewebe.',
        description: `Die Tiefengewebsmassage konzentriert sich auf das Neujustieren tieferer Muskelschichten und des Bindegewebes und ist besonders wirksam bei chronischen Schmerzen. 
        Diese Massageform wird häufig zur Behandlung von Nackenverspannungen, Rückenschmerzen, verspannten Muskeln und schmerzenden Schultern eingesetzt. 

        Mit langsamen Streichbewegungen und intensiverem Druck löst der Masseur Knoten und Verklebungen im Muskelgewebe. 
        Diese Massage ist ideal für Personen, die einen stärkeren Druck bevorzugen und Linderung bei verspannten, schmerzhaften Muskeln suchen.` 
      },
      es: { 
        name: 'Masaje de Tejido Profundo', 
        shortDescription: 'Un masaje terapéutico que se enfoca en las capas profundas del tejido muscular para aliviar el dolor crónico.',
        description: `El masaje de tejido profundo se enfoca en realinear las capas más profundas de los músculos y el tejido conectivo, siendo particularmente efectivo para dolores crónicos. 
        Este tipo de masaje es ideal para tratar rigidez en el cuello, dolor lumbar, músculos tensos y hombros adoloridos. 

        Utilizando movimientos más lentos y mayor presión, el terapeuta trabaja para descomponer los nudos y adhesiones en el tejido muscular. 
        Este masaje es perfecto para personas que prefieren una presión más fuerte y buscan alivio de músculos tensos y dolorosos.` 
      }
    }
  },
  tantric: {
    minutes: 75,
    translations: {
      en: { 
        name: 'Tantric Massage', 
        shortDescription: 'A holistic massage combining physical and spiritual elements to enhance relaxation and energy flow.',
        description: `Tantric Massage is a unique holistic experience that incorporates both physical touch and spiritual energy flow. 
        This massage helps release tension from the body while promoting a deeper connection with one's energy and emotions. 

        By combining soothing strokes with a mindful approach, Tantric Massage encourages relaxation, inner peace, and an enhanced sense of well-being. 
        This massage is ideal for individuals looking to connect body and mind in a deeply meditative and healing way.` 
      },
      nb: { 
        name: 'Tantrisk Massasje', 
        shortDescription: 'En helhetlig massasje som kombinerer fysiske og åndelige elementer for å fremme avslapning og energiflyt.',
        description: `Tantrisk Massasje er en unik helhetlig opplevelse som inkorporerer både fysisk berøring og åndelig energiflyt. 
        Denne massasjen bidrar til å frigjøre spenninger i kroppen samtidig som den fremmer en dypere forbindelse med ens energi og følelser. 

        Ved å kombinere beroligende strøk med en oppmerksom tilnærming, oppmuntrer Tantrisk Massasje til avslapning, indre fred og en forbedret følelse av velvære. 
        Denne massasjen er ideell for de som ønsker å koble sammen kropp og sinn på en dypt meditativ og helbredende måte.` 
      },
      de: { 
        name: 'Tantramassage', 
        shortDescription: 'Eine ganzheitliche Massage, die körperliche und spirituelle Elemente kombiniert, um Entspannung und Energiefluss zu fördern.',
        description: `Die Tantramassage ist eine einzigartige, ganzheitliche Erfahrung, die sowohl körperliche Berührung als auch spirituellen Energiefluss einbezieht. 
        Diese Massage hilft, Verspannungen im Körper zu lösen und gleichzeitig eine tiefere Verbindung zur eigenen Energie und den Emotionen zu fördern. 

        Durch die Kombination aus beruhigenden Streichbewegungen und einer achtsamen Herangehensweise fördert die Tantramassage Entspannung, inneren Frieden und ein gesteigertes Wohlbefinden. 
        Diese Massage ist ideal für Menschen, die Körper und Geist auf eine tief meditierende und heilende Weise miteinander verbinden möchten.` 
      },
      es: { 
        name: 'Masaje Tántrico', 
        shortDescription: 'Un masaje holístico que combina elementos físicos y espirituales para mejorar la relajación y el flujo de energía.',
        description: `El masaje tántrico es una experiencia holística única que incorpora tanto el tacto físico como el flujo de energía espiritual. 
        Este masaje ayuda a liberar la tensión del cuerpo mientras promueve una conexión más profunda con la energía y las emociones propias. 

        Al combinar movimientos relajantes con un enfoque consciente, el masaje tántrico fomenta la relajación, la paz interior y un mayor bienestar. 
        Este masaje es ideal para personas que buscan conectar cuerpo y mente de una manera profundamente meditativa y curativa.` 
      }
    }
  },
};
