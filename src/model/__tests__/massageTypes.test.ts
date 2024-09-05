jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    GoogleAuthProvider: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    onSnapshot: jest.fn(),
  };
});

import { renderHook, waitFor } from '@testing-library/react';
import { useMassageTypes } from '../massageTypes';
import { onSnapshot } from 'firebase/firestore';
import { AddonFs, AddonTranslationFs, MassageTypeFs } from '../bookingTypes';

const mockedOnSnapshot = onSnapshot as jest.Mock;

describe('useMassageTypes hook', () => {
  beforeEach(() => {
    mockedOnSnapshot.mockClear();
  });

  it('should return rich massage types after fetching', async () => {
    const mockMassageTypes: MassageTypeFs[] = [
      { id: '1', masseurId: 'masseur123', minutes: 45, addons: [ 'a1', 'a2' ], cost: 100 },
      { id: '2', masseurId: 'masseur123', minutes: 60, addons: [ 'a1' ], cost: 150 }
    ];

    const mockTranslations = [
      { id: 'mtt1', massageTypeId: '1', language: 'en', name: 'Massage A', shortDescription: 'Description A' },
      { id: 'mtt2', massageTypeId: '2', language: 'en', name: 'Massage B', shortDescription: 'Description B' }
    ];

    const mockAddons: AddonFs[] = [
      { id: 'a1', masseurId: 'masseur123', minutes: 15, cost: 30 },
      { id: 'a2', masseurId: 'masseur123', minutes: 20, cost: 35 },
      { id: 'a3', masseurId: 'masseur123', minutes: 25, cost: 40 },
    ];

    const mockAddonTranslations: AddonTranslationFs[] = [
      { id: 'at1', addonId: 'a1', language: 'nb', name: 'Dusjrituale', shortDescription: 'Shower thing', description: 'Long shower thing' },
      { id: 'at2', addonId: 'a1', language: 'en', name: 'Shower Ritual', shortDescription: 'Shower thing', description: 'Long shower thing' },
      { id: 'at3', addonId: 'a2', language: 'nb', name: 'Meditasjon', shortDescription: 'Meditasjon i par', description: 'Long shower thing' },
    ];

    const toDocs = (m) => {
      const { id, ...rest } = m;
      return { id: id, data: () => rest }
    }

    // Mocking Firestore snapshots for massage types
    mockedOnSnapshot.mockImplementationOnce((_, callback) => {
      callback({ docs: mockMassageTypes.map(toDocs) });
      return () => {}
    });

    // Mocking Firestore snapshots for translations
    mockedOnSnapshot.mockImplementationOnce((_, callback) => {
      callback({ docs: mockTranslations.map(toDocs) });
      return () => {}
    });

    mockedOnSnapshot.mockImplementationOnce((_, callback) => {
      callback({ docs: mockAddons.map(toDocs) });
      return () => {}
    });

    mockedOnSnapshot.mockImplementationOnce((_, callback) => {
      callback({ docs: mockAddonTranslations.map(toDocs) });
      return () => {}
    });

    mockedOnSnapshot.mockImplementation((_, _1) => {
      return () => {}
    });

    const { result } = renderHook(() => useMassageTypes('masseur123'));

    await waitFor(() =>
      expect(result.current).toHaveLength(2));

    // Test the final state after waiting
    expect(result.current).toEqual([
      { id: '1', masseurId: 'masseur123', minutes: 45, cost: 100, translations: { en: mockTranslations[0] },
        addons: [ { ...mockAddons[0], translations: { nb: mockAddonTranslations[0], en: mockAddonTranslations[1] } },
          { ...mockAddons[1], translations: { nb: mockAddonTranslations[2] } }]
      },
      { id: '2', masseurId: 'masseur123', minutes: 60, cost: 150, translations: { en: mockTranslations[1] },
        addons: [ { ...mockAddons[0], translations: { nb: mockAddonTranslations[0], en: mockAddonTranslations[1] } } ] }
    ]);
  });
});
