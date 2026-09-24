import { db } from './firebase'
import {
  collection, getDocs, query, where,
  doc, setDoc, getDoc, increment, Timestamp
} from 'firebase/firestore'


export const currency = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v)


export const getMembers = async () => {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(u => u.role === 'member' && u.status === 'active')
}


export const getAllReferrals = async () => {
  const snap = await getDocs(collection(db, 'referrals'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


export const getAllMeetings = async () => {
  const snap = await getDocs(collection(db, 'meetings'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


// ✅ Returns { uid: palmsData } map — used by Directory.jsx
export const getAllPalms = async () => {
  const snap = await getDocs(collection(db, 'palms'))
  const map = {}
  snap.docs.forEach(d => {
    const data = d.data()
    map[data.uid] = data
  })
  return map
}


export const getMemberMeetings = async (uid) => {
  const snap = await getDocs(
    query(collection(db, 'meetings'), where('memberId', '==', uid))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


export const getMemberProjects = async (uid) => {
  const snap = await getDocs(
    query(collection(db, 'projects'), where('memberId', '==', uid))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}


export const getMemberReferrals = async (uid) => {
  const [fromSnap, toSnap] = await Promise.all([
    getDocs(query(collection(db, 'referrals'), where('from', '==', uid))),
    getDocs(query(collection(db, 'referrals'), where('to',   '==', uid))),
  ])
  const map = {}
  ;[...fromSnap.docs, ...toSnap.docs].forEach(d => {
    map[d.id] = { id: d.id, ...d.data() }
  })
  return Object.values(map)
}


export const getMemberPalms = async (uid) => {
  const snap = await getDocs(
    query(collection(db, 'palms'), where('uid', '==', uid))
  )
  return snap.empty ? {} : snap.docs[0].data()
}


/* ─── Overall Activity Slips ─────────────────────────────────────────────── */

/**
 * Increments (or decrements) a slip field in the member's overall totals doc.
 * Path: memberSlips/{uid}
 *
 * Used for both:
 *   - + button  → amount = +step  (e.g. +1 or +1000)
 *   - edit input → amount = newVal - oldVal  (can be negative for corrections)
 *
 * @param {string} uid    - Member's Firebase UID
 * @param {string} type   - 'tyfcb' | 'referrals' | 'ceu' | 'oneToOne'
 * @param {number} amount - Delta to apply (positive or negative)
 */
export const incrementSlip = async (uid, type, amount) => {
  const ref = doc(db, 'memberSlips', uid)
  await setDoc(
    ref,
    {
      [type]: increment(amount),
      uid,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )

  const palmsRef = doc(db, 'palms', uid)
  const palmsKey = type === 'oneToOne' ? 'oneToOne' : type
  await setDoc(
    palmsRef,
    {
      [palmsKey]: increment(amount),
      uid,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )
}


/**
 * Fetches the overall slip totals for a member.
 * Returns an object like: { tyfcb: 305000, referrals: 12, ceu: 8, oneToOne: 24 }
 * Returns {} if no slips have been logged yet.
 *
 * @param {string} uid - Member's Firebase UID
 */
export const getMemberSlips = async (uid) => {
  const ref  = doc(db, 'memberSlips', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : {}
}


/* ─── Weekly Slips (kept for backward compatibility) ─────────────────────── */

/**
 * Returns the ISO week key for the current week, e.g. "2026-W21"
 */
const getWeekKey = () => {
  const now  = new Date()
  const jan1 = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - jan1) / 86_400_000 + jan1.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}


/**
 * Increments a slip field for the current week.
 * Path: weeklySlips/{uid}/weeks/{weekKey}
 *
 * @param {string} uid    - Member's Firebase UID
 * @param {string} type   - Field key: 'tyfcb' | 'referrals' | 'ceu' | 'oneToOne'
 * @param {number} amount - Positive number to add
 */
export const saveWeeklySlip = async (uid, type, amount) => {
  const weekKey = getWeekKey()
  const ref = doc(db, 'weeklySlips', uid, 'weeks', weekKey)
  await setDoc(
    ref,
    {
      [type]:    increment(amount),
      uid,
      weekKey,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  )
}


/**
 * Fetches the current week's slip totals for a member.
 * Returns {} if no slips have been logged yet this week.
 *
 * @param {string} uid - Member's Firebase UID
 */
export const getWeeklySlips = async (uid) => {
  const weekKey = getWeekKey()
  const ref  = doc(db, 'weeklySlips', uid, 'weeks', weekKey)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : {}
}