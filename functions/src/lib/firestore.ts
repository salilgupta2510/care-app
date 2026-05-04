import * as admin from 'firebase-admin';

export const db = () => admin.firestore();

export async function findPatientByPhone(phone: string) {
  const snap = await db()
    .collection('patients')
    .where('phone', '==', phone)
    .limit(1)
    .get();
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

export async function createUnknownPatient(phone: string, name?: string): Promise<string> {
  const ref = await db().collection('patients').add({
    name: name ?? 'Unknown Patient',
    phone,
    tags: ['unverified'],
    assignedTo: null,
    lastContactAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function getOrCreateOpenChat(patientId: string): Promise<string> {
  const existing = await db()
    .collection('chats')
    .where('patientId', '==', patientId)
    .where('status', '==', 'open')
    .limit(1)
    .get();

  if (!existing.empty) {
    await existing.docs[0].ref.update({
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: admin.firestore.FieldValue.increment(1),
    });
    return existing.docs[0].id;
  }

  const ref = await db().collection('chats').add({
    patientId,
    status: 'open',
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    unreadCount: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function isMessageDuplicate(waMessageId: string): Promise<boolean> {
  const snap = await db()
    .collectionGroup('messages')
    .where('waMessageId', '==', waMessageId)
    .limit(1)
    .get();
  return !snap.empty;
}

export async function getRecentMessages(chatId: string, limit = 20): Promise<string[]> {
  const snap = await db()
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .where('type', '==', 'text')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snap.docs.reverse().map((d) => d.data().content as string);
}
