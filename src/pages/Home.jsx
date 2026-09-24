import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Users,
  Globe,
  CalendarCheck,
  MapPin,
  Quote,
  Sparkles,
  Languages,
  Briefcase,
  TrendingUp,
  BookOpenText,
  Smartphone,
  Mail,
} from 'lucide-react'
import { db } from '../data/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { CHAPTER_SLUG } from '../data/chapters'


// ─── Static data ───────────────────────────────────────────────────────────────

const region = { totalMembers: '100+', totalChapters: 3, totalEvents: 12 }

const featuredMembers = [
  {
    name: 'Meenakshi V.',
    title: 'Financial Analyst, London',
    quote: 'YAAM gave me language to speak my expertise and a room full of people who understood both.',
  },
  {
    name: 'Arun K.',
    title: 'Trade Consultant, Singapore',
    quote: 'It feels like a borderless Tamil boardroom where ideas become introductions and introductions become impact.',
  },
  {
    name: 'Priya S.',
    title: 'Policy Researcher, Chennai',
    quote: 'I came for the network, stayed for the confidence, and found my voice in Tamil and English.',
  },
]

const upcomingEvents = [
  {
    title: 'Tamil Careers Without Borders',
    date: 'Sat, 08 Jun 2026',
    place: 'Online Forum',
    description: 'A practical conversation on global careers, communication, and cross-border professional growth.',
  },
  {
    title: 'Tamil Trade & Markets Meetup',
    date: 'Thu, 20 Jun 2026',
    place: 'Chennai',
    description: 'A discussion on business expansion, trade links, and opportunities across Tamil professional networks.',
  },
  {
    title: 'Public Policy and Economic Voice',
    date: 'Sun, 07 Jul 2026',
    place: 'London',
    description: 'A member-led session on how Tamil professionals can shape economic and policy conversations.',
  },
]

const forumPosts = [
  {
    category: 'CAREER GROWTH',
    title: 'Salary negotiation for Tamil professionals: a respectful, practical guide',
    body: 'Navigating salary conversations in global workplaces while staying true to who you are. Real strategies, real outcomes — in Tamil and English.',
    icon: Briefcase,
  },
  {
    category: 'COMMUNITY STORY',
    title: "From Jaffna to Frankfurt: one economist's journey across three continents",
    body: 'A Sri Lankan Tamil economist reflects on building a career in Germany — the language barriers, the small victories, and what stayed constant.',
    icon: Globe,
  },
  {
    category: 'INDUSTRY INSIGHTS',
    title: 'Tamil fintech founders are reshaping digital banking across Southeast Asia',
    body: "From Kuala Lumpur to Singapore, Tamil-led fintech ventures are quietly building the region's financial infrastructure.",
    icon: TrendingUp,
  },
]

// ─── Dummy leadership data ────────────────────────────────────────────────────

const DUMMY_LEADERS = [
  { id: 'l1', roleLabel: 'President', name: 'To be announced' },
  { id: 'l2', roleLabel: 'Secretary', name: 'To be announced' },
  { id: 'l3', roleLabel: 'Treasurer', name: 'To be announced' },
  { id: 'l4', roleLabel: 'Coordinator', name: 'To be announced' },
]

// ─── Shared avatar ─────────────────────────────────────────────────────────────

function Avatar({ photoURL, name, photoPosition = '50% 18%' }) {
  const initials = name
    ? name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : '?'

  return (
    <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-[#E8ECF8] dark:bg-[#1c2340] dark:border-[#1c2340] shadow-sm">
      {photoURL ? (
        <img
          src={photoURL}
          alt={name}
          className="w-full h-full object-cover"
          style={{ objectPosition: photoPosition }}
          loading="lazy"
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-lg font-bold text-[#1A2B6B] dark:text-[#8899d4]">
          {initials}
        </span>
      )}
    </div>
  )
}

// ─── One card for both sections ────────────────────────────────────────────────

function PersonCard({ name, roleLabel, company, photoURL, phone, email, profileHref, showProfile = true, photoPosition }) {
  const cleanPhone = phone ? phone.replace(/\D/g, '') : ''
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : ''

  return (
    <div className="w-full max-w-[300px] h-full min-h-[220px] bg-white dark:bg-[#13192e] rounded-2xl border border-[#E8ECF8] dark:border-[#2a3460] shadow-xl hover:shadow-md transition-shadow p-3 flex flex-col items-center text-center">
      <Avatar photoURL={photoURL} name={name} photoPosition={photoPosition} />

      <h3 className="mt-3 font-bold text-lg text-gray-900 dark:text-[#DDE3F5] leading-tight">
        {name}
      </h3>

      <p className="text-sm text-gray-700 font-semibold dark:text-[#8899d4] mt-1">
        {roleLabel}
      </p>

      <div className="mt-2 w-full flex justify-center">
        <div className="inline-flex items-center justify-center gap-3 rounded-full border border-[#E8ECF8] dark:border-[#2a3460] bg-[#F5F6FA] dark:bg-[#1c2340] px-4 py-2">
          {phone ? (
            <a
              href={whatsappUrl || `tel:${phone}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`Chat on WhatsApp: ${phone}`}
              className="flex items-center justify-center text-[#059669] dark:text-[#34D399] hover:text-[#25D366] transition-colors"
              aria-label="WhatsApp Chat"
            >
              <Smartphone size={15} />
            </a>
          ) : (
            <span
              title="WhatsApp / Phone not provided in profile"
              className="flex items-center justify-center text-[#9AA3BF]/40 dark:text-[#667085]/40 cursor-not-allowed"
              aria-label="WhatsApp not provided"
            >
              <Smartphone size={15} />
            </span>
          )}

          {email ? (
            <a
              href={`mailto:${email}`}
              title={`Email: ${email}`}
              className="flex items-center justify-center text-[#1A2B6B] dark:text-[#8899d4] hover:text-[#D0021B] transition-colors"
              aria-label="Email"
            >
              <Mail size={15} />
            </a>
          ) : (
            <span
              title="Email not provided in profile"
              className="flex items-center justify-center text-[#9AA3BF]/40 dark:text-[#667085]/40 cursor-not-allowed"
              aria-label="Email not provided"
            >
              <Mail size={15} />
            </span>
          )}

          {showProfile && (
            <>
              <span className="h-4 w-px bg-[#C5CCE8] dark:bg-[#2a3460]" />

              {profileHref ? (
                <Link
                  to={profileHref}
                  className="text-xs font-bold text-[#1A2B6B] dark:text-[#8899d4] hover:text-[#D0021B] transition-colors whitespace-nowrap"
                >
                  View Profile
                </Link>
              ) : (
                <span className="text-xs font-bold text-[#1A2B6B] dark:text-[#8899d4] whitespace-nowrap">
                  View Profile
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="w-full h-full min-h-[320px] bg-white dark:bg-[#13192e] rounded-2xl border border-[#E8ECF8] dark:border-[#2a3460] p-5 flex flex-col items-center gap-2 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-[#E8ECF8] dark:bg-[#1c2340]" />
      <div className="h-3 w-28 bg-[#E8ECF8] dark:bg-[#1c2340] rounded-full mt-2" />
      <div className="h-2.5 w-20 bg-[#E8ECF8] dark:bg-[#1c2340] rounded-full" />
      <div className="h-2.5 w-24 bg-[#E8ECF8] dark:bg-[#1c2340] rounded-full" />
      <div className="mt-auto w-full pt-3">
        <div className="h-px bg-[#E8ECF8] dark:bg-[#2a3460]" />
      </div>
    </div>
  )
}

// ─── Main Home component ───────────────────────────────────────────────────────

export default function Home() {
  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'member'),
        )
        const snap = await getDocs(q)
        const chapterMembers = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((member) => member.status === 'active' && member.chapterSlug === CHAPTER_SLUG)
          .slice(0, 6)
        setMembers(chapterMembers)
      } catch (err) {
        console.error('Home: failed to fetch members', err)
      } finally {
        setMembersLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDE8EB] dark:bg-[#3d0008]/50 text-[#D0021B] text-xs font-bold uppercase tracking-[0.12em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D0021B] animate-pulse" />
              YAAM Economic Voices
            </div>

            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] text-[#1A2B6B] dark:text-[#DDE3F5]"
              style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
            >
              Where Tamil economic voices{' '}
              <span className="relative inline-block">
                <span className="text-[#D0021B]">shape the world.</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D0021B] to-[#D0021B]/20 rounded-full" />
              </span>
            </h1>

            <p className="mt-6 text-gray-900 dark:text-[#8899d4] text-base font-bold sm:text-lg leading-relaxed max-w-lg">
              A borderless community of Tamil professionals building influence across business,
              economics, trade, and public policy, in the language of our roots.
            </p>

            <div className="mt-8 space-y-3 max-w-xl">
              <div className="flex items-start gap-3 text-sm text-gray-900 dark:text-[#DDE3F5]">
                <Languages size={18} className="text-[#D0021B] mt-0.5" />
                <span>Tamil is not just a language. It is how we think, build, and lead.</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-900 dark:text-[#DDE3F5]">
                <Users size={18} className="text-[#D0021B] mt-0.5" />
                <span>
                  Join a global forum where members share experience, opportunity, and solidarity.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-900 dark:text-[#DDE3F5]">
                <Sparkles size={18} className="text-[#D0021B] mt-0.5" />
                <span>
                  "யாம் பெற்ற இன்பம் பெறுக இவ்வையகம்" — the spirit that drives our community.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/visit-meeting"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white font-bold text-sm transition-all shadow-[0_2px_12px_rgba(208,2,27,0.30)] hover:shadow-[0_4px_16px_rgba(208,2,27,0.40)] hover:-translate-y-0.5"
              >
                Join the forum — grow <ArrowRight size={15} />
              </Link>
              <Link
                to="/members"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1A2B6B] dark:border-[#4a5a9a] text-[#1A2B6B] dark:text-[#8899d4] font-bold text-sm hover:bg-[#1A2B6B] hover:text-white dark:hover:bg-[#1A2B6B] dark:hover:text-white transition-all"
              >
               See  Members   <ArrowRight size={15} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-6 border-t border-[#E8ECF8] dark:border-[#2a3460]">
              <div className="flex items-center gap-1.5 bg-[#1A2B6B] px-4 py-2 rounded-full">
                <MapPin size={13} className="text-white" />
                <span className="text-xs text-white font-medium">Global Tamil community</span>
              </div>
              <div className="flex items-center bg-[#1A2B6B] px-4 py-2 rounded-full">
                <span className="text-xs text-white font-medium">Tamil</span>
              </div>
              <div className="flex items-center bg-[#1A2B6B] px-4 py-2 rounded-full">
                <span className="text-xs text-white font-medium">Free membership</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#13192e] rounded-3xl border border-[#C5CCE8] dark:border-[#2a3460] p-6 shadow-[0_8px_32px_rgba(26,43,107,0.12)]">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-4 rounded-full bg-[#D0021B]" />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#D0021B]">
                Community at a glance
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Members', value: region.totalMembers, icon: Users },
                { label: 'Chapters', value: region.totalChapters, icon: BookOpenText },
                { label: 'Regions', value: 'Global', icon: Globe },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-2xl bg-[#E8ECF8] dark:bg-[#1c2340] border border-[#C5CCE8] dark:border-[#2a3460]"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1A2B6B]/10 dark:bg-white/5 text-[#1A2B6B] dark:text-[#8899d4] grid place-items-center mx-auto mb-2">
                    <Icon size={17} />
                  </div>
                  <p
                    className="font-bold text-xl text-[#1A2B6B] dark:text-[#DDE3F5]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-[12px] dark:text-white/80 text-gray-900 font-bold mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {featuredMembers.map((member) => (
                <div
                  key={member.name}
                  className="p-4 rounded-2xl bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460]"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-7 rounded-xl bg-[#1A2B6B] text-white grid place-items-center font-bold">
                      <Quote size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#111E4F] dark:text-[#DDE3F5]">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-white/80 mt-0.5">
                        {member.title}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-[#C9D2F2] mt-2 leading-relaxed">
                        {member.quote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ── 3. Chapter Leadership ────────────────────────────────────────────── */}
      <section className="bg-[#E8ECF8] dark:bg-[#0f1628] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D0021B] mb-3">
              Chapter Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
              Meet your chapter leaders.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-[#8899d4]">
              Elected members steering the vision, growth, and community of our chapter.
            </p>
          </div>

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-x-0 h-px bg-[#E0E4F0] dark:bg-[#2a3460]" />
            <span className="relative  px-4 text-xl font-bold text-gray-900 dark:text-[#4a5a9a] tracking-wide">
              Leadership Committee
            </span>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-5">
              {DUMMY_LEADERS.map((leader) => (
                <div key={leader.id} className="w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] flex justify-center">
                  <PersonCard
                    name={leader.name}
                    roleLabel={leader.roleLabel}
                    photoURL={leader.photoURL}
                    photoPosition={leader.photoPosition}
                    phone={leader.phone}
                    email={leader.email}
                    showProfile={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Members ───────────────────────────────────────────────────────── */}
      <section className=" dark:bg-[#0b1120] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D0021B] mb-3">
              Our Members
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
              Voices from the forum
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-[#8899d4]">
              Stories from Tamil professionals across cities, sectors, and time zones.
            </p>
          </div>

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-x-0 h-px bg-[#C5CCE8] dark:bg-[#2a3460]" />
            <span className="relative bg-[#E8ECF8] dark:bg-[#0b1120] px-4 text-xl font-bold text-gray-900 dark:text-[#4a5a9a] tracking-wide">
              Membership Committee
            </span>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 auto-rows-fr justify-items-center">
              {membersLoading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                : members.length > 0
                  ? members.map((member) => (
                    <PersonCard
                      key={member.id}
                      name={member.name}
                      roleLabel={member.committeeName || member.role || 'Member'}
                      company={member.company || member.businessName || ''}
                      photoURL={member.photoURL}
                      phone={member.phone}
                      email={member.email}
                      profileHref={`/members/${member.uid || member.id}`}
                    />
                  ))
                  : (
                    <p className="col-span-full text-center text-sm font-semibold text-[#6B7280] dark:text-[#8899d4] py-10">
                      Chapter members will appear here once they are added.
                    </p>
                  )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1A2B6B] dark:border-[#4a5a9a] text-[#1A2B6B] dark:text-[#8899d4] font-bold text-sm hover:bg-[#1A2B6B] hover:text-white dark:hover:bg-[#1A2B6B] dark:hover:text-white transition-all"
            >
              <Users size={15} />
              View all members
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Upcoming events ───────────────────────────────────────────────── */}
      {/* <section className="bg-[#F5F6FA] dark:bg-[#0f1628] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D0021B] mb-2">
                Upcoming events
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
                Gather, learn, and lead.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-[#8899d4] max-w-2xl">
                Events that connect Tamil professionals through meaningful conversation, practical
                learning, and shared opportunity.
              </p>
            </div>
            <Link
              to="/events"
              className="shrink-0 inline-flex items-center justify-center rounded-full bg-[#D0021B] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#b00117]"
            >
              View all events →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-2xl border border-[#E8ECF8] dark:border-[#2a3460] bg-white dark:bg-[#13192e] p-6"
              >
                <div className="flex items-center gap-2 text-[#D0021B] font-bold text-xs uppercase tracking-[0.12em] mb-4">
                  <CalendarCheck size={15} />
                  Event
                </div>
                <h3 className="font-bold text-lg text-[#1A2B6B] dark:text-[#DDE3F5]">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-[#8899d4] mt-2">
                  {event.description}
                </p>
                <div className="mt-4 text-sm text-[#111E4F] dark:text-[#C9D2F2]">
                  <p><span className="font-bold">Date:</span> {event.date}</p>
                  <p><span className="font-bold">Place:</span> {event.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── 2. Forum posts ───────────────────────────────────────────────────── */}
      <section className="bg-[#E8ECF8]  dark:bg-[#0b1120] py-18">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D0021B] mb-3">
              Latest from the forum
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2B6B] dark:text-[#DDE3F5]">
              Conversations that matter.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mt-10">
            {forumPosts.map(({ category, title, body, icon: Icon }) => (
              <article
                key={title}
                className="bg-white dark:bg-[#13192e] rounded-2xl p-6 border border-[#C5CCE8] dark:border-[#2a3460]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8ECF8] dark:bg-[#1c2340] text-[#1A2B6B] dark:text-[#8899d4] grid place-items-center mb-4">
                  <Icon size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#D0021B]">
                  {category}
                </p>
                <h3 className="mt-2 font-bold text-lg text-[#1A2B6B] dark:text-[#DDE3F5]">
                  {title}
                </h3>
                <p className="mt-3 text-sm text-gray-700 dark:text-[#8899d4] leading-relaxed">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA banner ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A2B6B] via-[#111E4F] to-[#0C1535] text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D0021B]/10 pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#FFB6C1] text-xs font-bold uppercase tracking-widest mb-4">
              யாம் — WE
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              One language. Thousands of careers.
            </h2>
            <p className="mt-2 text-[#8899d4] max-w-lg">
              Join the community that sees language as your greatest professional asset.
            </p>
          </div>
          <Link
            to="/visit-meeting"
            className="relative shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white font-bold transition-all shadow-[0_4px_16px_rgba(208,2,27,0.40)] hover:shadow-[0_6px_20px_rgba(208,2,27,0.50)] hover:-translate-y-0.5"
          >
            Join the forum — grow <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}