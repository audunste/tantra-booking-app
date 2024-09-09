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
import { Addon, MassageTypeFs } from '../bookingTypes';

const mockedOnSnapshot = onSnapshot as jest.Mock;

describe('useMassageTypes hook', () => {
  beforeEach(() => {
    mockedOnSnapshot.mockClear();
  });

  it('should return rich massage types after fetching', async () => {
    const mockMassageTypes: MassageTypeFs[] = [
      { 
        id: '1', masseurId: 'masseur123', minutes: 45, addonIds: [ 'a1', 'a2' ], cost: 100,
        translations: {
          'en': {
            name: 'Massage A',
            shortDescription: 'Description A',
            description: ''
          }
        }
      },
      {
        id: '2', masseurId: 'masseur123', minutes: 60, addonIds: [ 'a1' ], cost: 150,
        translations: {
          'en': {
            name: 'Massage B',
            shortDescription: 'Description B',
            description: ''
          }
        }

      }
    ];

    const mockAddons: Addon[] = [
      { id: 'a1', masseurId: 'masseur123', minutes: 15, cost: 30,
        translations: {
          'nb': { name: 'Dusjrituale', shortDescription: 'Shower thing', description: 'Long shower thing' },
          'en': { name: 'Shower Ritual', shortDescription: 'Shower thing', description: 'Long shower thing' }
        }
      },
      { id: 'a2', masseurId: 'masseur123', minutes: 20, cost: 35,
        translations: {
          'nb': { name: 'Meditasjon', shortDescription: 'Meditasjon i par', description: 'Long shower thing' }
        }
      },
      { id: 'a3', masseurId: 'masseur123', minutes: 25, cost: 40,
        translations: {}
      },
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
      callback({ docs: mockAddons.map(toDocs) });
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
      { id: '1', masseurId: 'masseur123', minutes: 45, cost: 100, translations: { ...mockMassageTypes[0].translations },
        addons: [ { ...mockAddons[0] },
          { ...mockAddons[1] }]
      },
      { id: '2', masseurId: 'masseur123', minutes: 60, cost: 150, translations: { ...mockMassageTypes[1].translations },
        addons: [ { ...mockAddons[0] } ] }
    ]);
  });
});
