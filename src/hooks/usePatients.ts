import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy } from 'firebase/firestore';
import { patientsCol } from '@/lib/firestore';
import type { Patient } from '@/types/firestore';
import { SEED_PATIENTS } from '@/utils/seed';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

export function usePatients(search = '') {
  const [patients, setPatients] = useState<Patient[]>(USE_MOCK ? SEED_PATIENTS : []);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;

    const q = query(patientsCol(), orderBy('name', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map((d) => d.data()));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = patients.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return { patients: filtered, loading };
}

export function usePatient(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(
    USE_MOCK ? (SEED_PATIENTS.find((p) => p.id === patientId) ?? null) : null
  );
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK) return;
    // real impl: onSnapshot(doc(db, 'patients', patientId), ...)
    setLoading(false);
  }, [patientId]);

  return { patient, loading };
}
