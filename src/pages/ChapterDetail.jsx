import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../data/firebase'
import { chapters } from '../data/chapters'
import {
  CalendarDays, Clock3, MapPin, Users,
  ArrowLeft, TrendingUp, Loader2, ShieldCheck
} from 'lucide-react'
import Badge from '../components/Badge'
import MemberCard from '../components/MemberCard'
import SectionHeader from '../components/SectionHeader'

export default function ChapterDetail() {
  const { slug }  = useParams()
  const chapter   = chapters.find(c => c.slug === slug)

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!chapter) { setLoading(false); return }
    const load = async () => {
      try {
        const q    = query(
          collection(db, 'users'),
          where('chapterSlug', '==', slug),
          where('role', '==', 'member')
        )
        const snap = await getDocs(q)
        setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() })))
      } catch (err) {
        console.error('Failed to load members:', err)
        setError('Failed to load members.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, chapter])

  /* ── Not found ── */
  if (!chapter) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-[#6B7280] text-lg">Chapter not found.</p>
      <Link
        to="/chapters"
        className="mt-4 inline-block text-[#D0021B] hover:underline font-semibold"
      >
        ← Back to chapters
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Back link ── */}
      <Link
        to="/chapters"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#D0021B] mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={15} /> Back to all chapters
      </Link>

      {/* ── Hero card ────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#13192e] rounded-3xl border border-[#C5CCE8] dark:border-[#2a3460] overflow-hidden shadow-[0_2px_12px_rgba(26,43,107,0.10)] mb-8">

        {/* Header — full navy gradient */}
        <div className="relative bg-gradient-to-br from-[#1A2B6B] to-[#0C1535] px-7 py-8 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-[#D0021B]/10 pointer-events-none" />
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[#D0021B]/5 pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-5 relative">
            <Badge color="red">{chapter.mode}</Badge>
            <Badge color={chapter.category_open ? 'green' : 'gray'}>
              {chapter.category_open ? 'Category open' : 'Category closed'}
            </Badge>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight relative"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            {chapter.name}
          </h1>
          <p className="text-[#8899d4] mt-2 text-sm font-medium relative">
            Yaam Economic Forum
          </p>
        </div>

        {/* Stats row */}
        <div className="px-7 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-[#E8ECF8] dark:border-[#2a3460]">
          {[
            { icon: TrendingUp,   label: 'Business Passed', value: chapter.business,                  iconBg: 'bg-[#FDE8EB] dark:bg-[#3d0008]/40', iconColor: 'text-[#D0021B]' },
            { icon: CalendarDays, label: 'Meeting Day',     value: chapter.day,                       iconBg: 'bg-[#E8ECF8] dark:bg-[#1c2340]',    iconColor: 'text-[#1A2B6B] dark:text-[#8899d4]' },
            { icon: Clock3,       label: 'Meeting Time',    value: chapter.time,                      iconBg: 'bg-[#E8ECF8] dark:bg-[#1c2340]',    iconColor: 'text-[#1A2B6B] dark:text-[#8899d4]' },
            { icon: Users,        label: 'Members',         value: `${chapter.members} active members`, iconBg: 'bg-[#E8ECF8] dark:bg-[#1c2340]',  iconColor: 'text-[#1A2B6B] dark:text-[#8899d4]' },
          ].map(({ icon: Icon, label, value, iconBg, iconColor }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                <Icon size={17} className={iconColor} />
              </div>
              <div>
                <p className="text-xs text-[#9AA3BF] font-medium">{label}</p>
                <p className="font-bold text-sm mt-0.5 text-[#111E4F] dark:text-[#DDE3F5]">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Venue row */}
        <div className="px-7 py-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8ECF8] dark:bg-[#1c2340] flex items-center justify-center flex-shrink-0">
            <MapPin size={13} className="text-[#1A2B6B] dark:text-[#8899d4]" />
          </div>
          <span className="text-sm text-[#6B7280] dark:text-[#8899d4]">{chapter.venue}</span>
        </div>
      </div>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#13192e] rounded-2xl border border-[#C5CCE8] dark:border-[#2a3460] p-6 mb-8 shadow-[0_1px_3px_rgba(26,43,107,0.08)]">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-[#D0021B]" />
          <h2
            className="text-xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            About this chapter
          </h2>
        </div>

        <p className="text-[#6B7280] dark:text-[#8899d4] leading-relaxed">
          {chapter.name} is a dynamic, committed group of business people who know how to refer
          business to each other. We meet every {chapter.day} at {chapter.time} and focus on
          building deep, trusted relationships that translate into real business referrals. Our
          chapter has passed {chapter.business} in referral business this year alone.
        </p>
        <p className="text-[#6B7280] dark:text-[#8899d4] leading-relaxed mt-3">
          Search our members below to see if your category is open, then visit a meeting and lock
          out your competition. We welcome one new guest per category per meeting.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {[
            'One member per category',
            'Weekly structured meetings',
            'Verified referral tracking',
          ].map(f => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8ECF8] dark:bg-[#1c2340] text-[#1A2B6B] dark:text-[#8899d4] text-xs font-semibold"
            >
              <ShieldCheck size={11} className="text-[#D0021B]" />
              {f}
            </span>
          ))}
        </div>

        <Link
          to="/visit-meeting"
          className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white text-sm font-bold transition-all shadow-[0_2px_8px_rgba(208,2,27,0.25)] hover:shadow-[0_4px_12px_rgba(208,2,27,0.35)] hover:-translate-y-0.5"
        >
          Visit This Meeting →
        </Link>
      </div>

      {/* ── Members ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={28} className="animate-spin text-[#1A2B6B] dark:text-[#8899d4]" />
          <p className="text-[#9AA3BF] text-sm font-medium">Loading members…</p>
        </div>

      ) : error ? (
        <div className="text-center py-10">
          <p className="text-[#D0021B] font-medium">{error}</p>
        </div>

      ) : members.length > 0 ? (
        <div>
          <SectionHeader
            eyebrow="Members"
            title={`Meet the ${chapter.name} team`}
            subtitle="Each category is exclusive. Click any member to see their full profile and what they do."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map(m => <MemberCard key={m.uid} member={m} />)}
          </div>
        </div>

      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#13192e] rounded-2xl border border-[#C5CCE8] dark:border-[#2a3460]">
          <div className="w-14 h-14 rounded-2xl bg-[#E8ECF8] dark:bg-[#1c2340] flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-[#1A2B6B] dark:text-[#8899d4] opacity-40" />
          </div>
          <p className="font-semibold text-[#6B7280] dark:text-[#8899d4]">
            No members found for this chapter yet.
          </p>
          <p className="text-xs text-[#9AA3BF] mt-1">
            Members will appear here once they complete their profile.
          </p>
        </div>
      )}
    </div>
  )
}