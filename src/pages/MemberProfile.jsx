import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '../data/firebase'
import { cropToFace } from '../utils/cropToFace'
import { chapters, CHAPTER_SLUG, belongsToChapter } from '../data/chapters'
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Loader2,
  Building2,
  MapPin,
  Camera,
  Target,
  Star,
  Award,
  Briefcase,
  Heart,
  Trophy,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import Badge from '../components/Badge'
import { siteOrigin, absoluteUrl, setSeo, setJsonLd, clearJsonLd } from '../utils/seo'
import { memberIdFromParam, memberProfilePath } from '../utils/memberUrl'


const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)


const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'


/* ─── Section Header ─────────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, label, color = '#D0021B' }) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}22` }}
    >
      <Icon size={16} style={{ color }} />
    </div>
    <h2
      className="text-sm font-bold text-[#13245a] dark:text-[#E8EEF8] uppercase tracking-[0.08em]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {label}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-[#E2E8F4] to-transparent dark:from-[#1E2D4A] dark:to-transparent" />
  </div>
)


/* ─── Info Row ───────────────────────────────────────────────────── */
const InfoRow = ({ label, value }) =>
  value ? (
    <div className="group flex gap-4 py-3.5 border-b border-[#EEF1FA] dark:border-[#1C2A45] last:border-0 hover:bg-[#F8FAFF] dark:hover:bg-[#0F1828] transition-colors rounded-lg px-3 -mx-3">
      <span className="text-[12px] font-extrabold text-gray-700 dark:text-[#4A5568] uppercase tracking-[0.14em] w-36 shrink-0 pt-1">
        {label}
      </span>
      <span className="text-sm text-[#1F2937] dark:text-[#C8D5EE] leading-relaxed">
        {value}
      </span>
    </div>
  ) : null


/* ─── Stat Pill ──────────────────────────────────────────────────── */
const StatPill = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 rounded-2xl px-5 py-3.5 backdrop-blur-sm bg-white/10 border border-white/15 min-w-[88px]">
    <span className="text-white font-black text-2xl leading-none tabular-nums">{value}</span>
    <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">{label}</span>
  </div>
)


/* ─── Contact Button ─────────────────────────────────────────────── */
const ContactBtn = ({ href, icon: Icon, label, variant = 'default', external }) => {
  const variants = {
    default:  'border-[#D0DAF0] dark:border-[#1E2D4A] text-[#13245a] dark:text-[#C8D5EE] hover:border-[#1A2B6B] hover:bg-[#F0F4FF] dark:hover:bg-[#111B30]',
    linkedin: 'border-[#D0DAF0] dark:border-[#1E2D4A] text-[#0a66c2] dark:text-[#60A5FA] hover:border-[#0a66c2] hover:bg-[#EBF5FF] dark:hover:bg-[#0a1929]',
    email:    'border-[#D0DAF0] dark:border-[#1E2D4A] text-[#13245a] dark:text-[#C8D5EE] hover:border-[#D0021B] hover:text-[#D0021B] hover:bg-[#FFF0F2] dark:hover:bg-[#2A0008]',
    phone:    'border-[#D0DAF0] dark:border-[#1E2D4A] text-[#13245a] dark:text-[#C8D5EE] hover:border-[#059669] hover:text-[#059669] hover:bg-[#ECFDF5] dark:hover:bg-[#021A10]',
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${variants[variant]}`}
    >
      <Icon size={14} />
      <span>{label}</span>
      {external && <ExternalLink size={11} className="opacity-40" />}
    </a>
  )
}


/* ─── Sidebar Card ───────────────────────────────────────────────── */
const SideCard = ({ children, tint }) => (
  <div
    className="rounded-2xl border overflow-hidden p-5"
    style={{ background: tint?.bg, borderColor: tint?.border }}
  >
    {children}
  </div>
)


/* ─── Main Component ─────────────────────────────────────────────── */
export default function MemberProfile() {
  const { uid: memberParam } = useParams()
  const memberId = memberIdFromParam(memberParam)
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = auth.currentUser
  const isOwner = currentUser?.uid === memberId

  const [member, setMember]           = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [photoURL, setPhotoURL]       = useState('')
  const [lightbox, setLightbox]       = useState(null)
  const [imgLoaded, setImgLoaded]     = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!memberId) { setError('Invalid member link.'); setLoading(false); return }

    const load = async () => {
      const timeout = setTimeout(() => {
        setError('Request timed out. Please try again.')
        setLoading(false)
      }, 8000)

      try {
        const snap = await getDoc(doc(db, 'users', memberId))
        clearTimeout(timeout)
        if (!snap.exists()) {
          setError('Member not found.')
        } else if (snap.data().role !== 'member') {
          setError('This profile is not publicly accessible.')
        } else if (snap.data().status !== 'active') {
          setError('This profile is not publicly accessible.')
        } else if (!belongsToChapter(snap.data().chapterSlug)) {
          setError('Member not found.')
        } else {
          const data = { uid: snap.id, ...snap.data() }
          setMember(data)
          setPhotoURL(data.photoURL || '')
        }
      } catch (err) {
        clearTimeout(timeout)
        if (err.code === 'permission-denied') setError('This profile is not publicly accessible.')
        else if (err.code === 'unavailable')  setError('Network error. Please check your connection.')
        else setError('Failed to load member profile.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [memberId])

  useEffect(() => {
    if (!member) return

    const name = member.name || 'Member'
    const extras = [member.industry, member.business].filter(Boolean)
    const extraText = extras.length ? ` ${extras.join(', ')}.` : ''
    const description = `${name} is a member of YEF Thozhilnagaram (Yaam Economic Forum).${extraText}`
    const path = memberProfilePath(member)
    const image = member.photoURL || photoURL || undefined
    const origin = siteOrigin()

    if (location.pathname !== path) {
      navigate(path, { replace: true })
    }

    setSeo({
      title: `${name} | YEF Thozhilnagaram | Yaam Economic Forum`,
      description,
      path,
      image,
      type: 'profile',
    })

    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      jobTitle: member.industry || undefined,
      image: image || undefined,
      url: absoluteUrl(path),
      worksFor: {
        '@type': 'Organization',
        name: 'Yaam Economic Forum',
        alternateName: 'YEF',
        url: origin,
      },
    })

    return () => clearJsonLd()
  }, [member, photoURL, location.pathname, navigate])

  const handlePhotoChange = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024)    { setUploadError('Image must be under 5 MB.');         return }
    if (!file.type.startsWith('image/')) { setUploadError('Please select a valid image file.'); return }

    setUploading(true)
    setUploadError('')
    try {
      let avatarBlob
      try {
        avatarBlob = await cropToFace(file)
      } catch (cropErr) {
        console.warn('Face crop failed, uploading original photo', cropErr)
        avatarBlob = file
      }

      const storageRef = ref(storage, `profiles/${memberId}/avatar`)
      await uploadBytes(storageRef, avatarBlob, { contentType: 'image/jpeg' })
      const url = await getDownloadURL(storageRef)
      await updateDoc(doc(db, 'users', memberId), { photoURL: url })
      setImgLoaded(false)
      setPhotoURL(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`)
    } catch (err) {
      console.error(err)
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  /* ── Loading ──────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1A2B6B]/10 to-[#D0021B]/10 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#141D35] border border-[#E0E7F5] dark:border-[#1E2D4A] shadow-sm flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-[#1A2B6B] dark:text-[#6D85CC]" />
            </div>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[#1F2937] dark:text-[#C8D5EE] text-sm font-semibold">Loading profile</p>
            <p className="text-[#9CAABB] text-xs">Just a moment…</p>
          </div>
        </div>
      </div>
    )
  }

  /* ── Error ────────────────────────────────────────────────────── */
  if (error || !member) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#F0F4FF] to-[#E8ECF8] dark:from-[#141D35] dark:to-[#1A2440] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#E0E7F5] dark:border-[#1E2D4A]">
          <Building2 size={32} className="text-[#1A2B6B]/30 dark:text-[#6D85CC]/30" />
        </div>
        <h2
          className="text-[#13245a] dark:text-[#E8EEF8] font-bold text-xl mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Profile unavailable
        </h2>
        <p className="text-[#7A86A8] dark:text-[#6080A8] text-sm mb-8 leading-relaxed">
          {error || 'Member not found.'}
        </p>
        <Link
          to="/members"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D0021B] hover:bg-[#B00218] text-white text-sm font-bold transition-all shadow-[0_4px_14px_rgba(208,2,27,0.3)] hover:shadow-[0_6px_20px_rgba(208,2,27,0.4)] hover:-translate-y-0.5"
        >
          <ArrowLeft size={14} /> Back to directory
        </Link>
      </div>
    )
  }

  /* ── Data ─────────────────────────────────────────────────────── */
  const initials    = getInitials(member.name)
  const category    = member.industry || '—'
  const company     = member.business || '—'
  const tags        = Array.isArray(member.tags)    ? member.tags    : []
  const gallery     = Array.isArray(member.gallery) ? member.gallery : []
  const chapter     = chapters.find(c => c.slug === member.chapterSlug)
    || (belongsToChapter(member.chapterSlug) ? chapters.find(c => c.slug === CHAPTER_SLUG) : undefined)
  const chapterName = chapter?.name || member.chapterSlug || 'Our Chapter'

  const gains = {
    goals:        member.gains_goals,
    achievements: member.gains_achievements,
    interests:    member.gains_interests,
    networks:     member.gains_networks,
    skills:       member.gains_skills,
  }
  const hasGains = Object.values(gains).some(Boolean)

  const tops = {
    teaching: member.tops_teaching,
    openings: member.tops_openings,
    products: member.tops_products,
    sought:   member.tops_sought,
  }
  const hasTops = Object.values(tops).some(Boolean)

  const hasContact =
    member.website ||
    member.linkedin ||
    (member.showEmail && member.email) ||
    (member.showPhone && member.phone)

  const hasStats = member.yearsInBusiness || member.referralsGiven || member.oneToOnes

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <div className="w-full px-4 sm:px-6 xl:px-10 py-8">

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all">
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="Gallery"
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}

      {/* Back link */}
      <Link
        to="/members"
        className="inline-flex items-center gap-2 text-sm text-[#7A8FAB] hover:text-[#D0021B] dark:text-[#4A6080] dark:hover:text-[#FF6070] mb-6 transition-colors font-medium group"
      >
        <span className="w-6 h-6 rounded-lg bg-[#F0F4FF] dark:bg-[#141D35] flex items-center justify-center group-hover:bg-[#FDE8EB] dark:group-hover:bg-[#2A0008] transition-colors">
          <ArrowLeft size={12} className="text-[#7A8FAB] group-hover:text-[#D0021B] transition-colors" />
        </span>
        Back to members
      </Link>

      {/* ── Outer card ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0E1625] rounded-3xl border border-[#E0E8F4] dark:border-[#1A2840] overflow-hidden shadow-[0_2px_24px_rgba(26,43,107,0.08),0_8px_48px_rgba(26,43,107,0.05)]">

        {/* ── Hero Banner (full-width) ───────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D1C50 0%, #1A2B6B 45%, #2A1540 100%)' }}
        >
          {/* Decorative overlays */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.055]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <div
              className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.09]"
              style={{ background: 'radial-gradient(circle, #D0021B 0%, transparent 65%)' }}
            />
            <div
              className="absolute -bottom-12 left-1/3 w-72 h-72 rounded-full opacity-[0.07]"
              style={{ background: 'radial-gradient(circle, #4060C0 0%, transparent 70%)' }}
            />
            <div
              className="absolute top-0 right-1/4 w-40 h-40 rounded-full opacity-[0.04]"
              style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
            />
          </div>

          {/* Hero content */}
          <div className="relative px-8 lg:px-12 pt-12 pb-10">
            <div className="flex flex-col sm:flex-row items-start gap-8">

              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-[1.35rem] overflow-hidden ring-[3px] ring-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={member.name}
                      className={`w-full h-full object-cover object-[center_20%] transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImgLoaded(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full grid place-items-center"
                      style={{ background: 'linear-gradient(135deg, #D0021B 0%, #7A0010 100%)' }}
                    >
                      <span
                        className="font-black text-white text-4xl tracking-tight"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                  {!imgLoaded && photoURL && (
                    <div className="absolute inset-0 bg-[#1A2B6B] animate-pulse" />
                  )}
                </div>

                {isOwner && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute inset-0 rounded-[1.35rem] bg-black/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {uploading
                        ? <Loader2 size={24} className="animate-spin text-white" />
                        : <Camera size={24} className="text-white drop-shadow" />
                      }
                      <span className="text-white text-[9px] font-bold uppercase tracking-wider">
                        {uploading ? 'Uploading…' : 'Change Photo'}
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </>
                )}

                {uploadError && (
                  <div className="absolute top-full mt-2 left-0 bg-[#D0021B] text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap z-10 shadow-lg font-medium">
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-start gap-2.5 mb-1">
                  <h1
                    className="text-[2.15rem] sm:text-[2.5rem] lg:text-[2.85rem] font-extrabold text-white leading-[1.08] tracking-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
                  >
                    {member.name || 'Member'}
                  </h1>
                  {member.memberSince && (
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-semibold">
                      Since {member.memberSince}
                    </span>
                  )}
                </div>

                <p className="text-white/75 text-sm font-medium mt-1">
                  YEF Thozhilnagaram · Yaam Economic Forum
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[#FF8F9E] font-semibold text-base">{category}</span>
                  {category !== '—' && company !== '—' && (
                    <span className="text-white/25">·</span>
                  )}
                  <span className="text-white/65 text-sm font-medium">{company}</span>
                </div>

                {member.tagline && (
                  <p className="text-white/80 text-sm italic mt-4 leading-relaxed border-l-2 border-white/20 pl-3 max-w-2xl">
                    "{member.tagline}"
                  </p>
                )}

                {hasStats && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {member.yearsInBusiness && (
                      <StatPill value={member.yearsInBusiness} label="Yrs in Biz" />
                    )}
                    {member.referralsGiven && (
                      <StatPill value={member.referralsGiven} label="Clients" />
                    )}
                    {member.oneToOnes && (
                      <StatPill value={member.oneToOnes} label="Projects" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-7 pt-5 border-t border-white/10">
              {member.chapterSlug && (
                <Link
                  to={`/chapters/${chapter?.slug || CHAPTER_SLUG}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/15 border border-white/12 text-white/75 hover:text-white text-xs font-semibold transition-all"
                >
                  <MapPin size={11} className="text-[#FF8F9E]" />
                  {chapterName}
                </Link>
              )}
              
            </div>
          </div>
        </div>

        {/* ── Body: two-column on large screens ─────────────── */}
        {/*
            LEFT  (flex-1): About, GAINS, TOPS, Commercial
            RIGHT (w-[380px]): Ideal Referral, Personal, Gallery, Contact
            On <lg both stack into a single column divide-y
        */}
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:divide-x lg:divide-[#EEF2FB] dark:lg:divide-[#141E32]">

          {/* ── Left column ─────────────────────────────────── */}
          <div className="divide-y divide-[#EEF2FB] dark:divide-[#141E32]">

            {/* About */}
            <section className="px-8 lg:px-10 py-8">
              <SectionHeader icon={Briefcase} label="About" color="#1A2B6B" />
              {member.bio ? (
                <p className="text-[#374151] dark:text-[#B8CAE4] text-[0.925rem] leading-[1.9] max-w-prose">
                  {member.bio}
                </p>
              ) : (
                <p className="italic text-[#9CAABB] text-sm">No bio added yet.</p>
              )}

              {member.businessDescription && member.businessDescription !== member.bio && (
                <div className="mt-5 rounded-2xl bg-[#F7F9FF] dark:bg-[#0B1424] border border-[#E4EAF8] dark:border-[#182236] p-5">
                  <p className="text-[10px] font-extrabold text-[#A0AAC0] dark:text-[#3A4D68] uppercase tracking-[0.16em] mb-3">
                    Business Description
                  </p>
                  <p className="text-sm text-[#374151] dark:text-[#B0C2DC] leading-relaxed">
                    {member.businessDescription}
                  </p>
                </div>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {tags.map(t => (
                    <Badge key={t} color="gray">{t}</Badge>
                  ))}
                </div>
              )}
            </section>

            {/* GAINS */}
            {hasGains && (
              <section className="px-8 lg:px-10 py-8 text-white">
                <SectionHeader icon={Target} label="GAINS Profile" color="#1A2B6B" />
                <div className="rounded-2xl  p-5 bg-[#F7F9FF] dark:bg-[#090F1C] border border-[#E4EAF8] dark:border-[#131D2E] overflow-hidden">
                  <InfoRow label="Goals"        value={gains.goals} />
                  <InfoRow label="Achievements" value={gains.achievements} />
                  <InfoRow label="Interests"    value={gains.interests} />
                  <InfoRow label="Networks"     value={gains.networks} />
                  <InfoRow label="Skills"       value={gains.skills} />
                </div>
              </section>
            )}

            {/* TOPS */}
            {hasTops && (
              <section className="px-8 lg:px-10 py-8">
                <SectionHeader icon={Trophy} label="TOPS Profile" color="#b45309" />
                <div className="rounded-2xl p-5 bg-[#FFFBF5] dark:bg-[#100C00] border border-[#F0E4CC] dark:border-[#201800] overflow-hidden">
                  <InfoRow label="Teaching"            value={tops.teaching} />
                  <InfoRow label="Openings"            value={tops.openings} />
                  <InfoRow label="Products / Services" value={tops.products} />
                  <InfoRow label="Referrals Sought"    value={tops.sought} />
                </div>
              </section>
            )}

            {/* 60-Second Commercial */}
            {member.commercial && (
              <section className="px-8 lg:px-10 py-8">
                <SectionHeader icon={Award} label="60-Second Commercial" color="#0369a1" />
                <div className="relative rounded-2xl bg-[#EFF8FF] dark:bg-[#040D18] border border-[#CCE7FF] dark:border-[#0D2035] p-5 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ background: 'linear-gradient(to bottom, #0369a1, #0284c7)' }}
                  />
                  <blockquote className="pl-4 italic text-[#1e40af] dark:text-[#93C5FD] text-[0.9rem] leading-relaxed">
                    "{member.commercial}"
                  </blockquote>
                </div>
              </section>
            )}
          </div>

          {/* ── Right column (sidebar) ───────────────────────── */}
          <div className="divide-y divide-[#EEF2FB] dark:divide-[#141E32]">

            {/* Contact — pinned at top of sidebar */}
            <section className="px-7 py-8">
              <SectionHeader icon={Phone} label="Contact" color="#1A2B6B" />
              {hasContact ? (
                <div className="flex flex-col gap-2">
                  {member.website && (
                    <ContactBtn href={member.website} icon={Globe} label="Website" variant="default" external />
                  )}
                  {member.linkedin && (
                    <ContactBtn href={member.linkedin} icon={LinkedinIcon} label="LinkedIn" variant="linkedin" external />
                  )}
                  {member.showEmail && member.email && (
                    <ContactBtn href={`mailto:${member.email}`} icon={Mail} label={member.email} variant="email" />
                  )}
                  {member.showPhone && member.phone && (
                    <ContactBtn href={`tel:${member.phone}`} icon={Phone} label={member.phone} variant="phone" />
                  )}
                </div>
              ) : (
                <p className="text-sm italic text-[#9CAABB]">No contact details available.</p>
              )}
            </section>

            {/* Ideal Referral */}
            {member.idealReferral && (
              <section className="px-7 py-8">
                <SectionHeader icon={Star} label="Ideal Referral" color="#7c3aed" />
                <div className="relative rounded-2xl bg-[#FAF5FF] dark:bg-[#0E0718] border border-[#EDE0FF] dark:border-[#1D0F30] p-5 overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-[0.07]"
                    style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
                  />
                  <p className="text-sm text-[#374151] dark:text-[#C4B8E8] leading-relaxed relative">
                    {member.idealReferral}
                  </p>
                </div>
              </section>
            )}

            {/* Personal */}
            {(member.hobbies || member.personalNote || member.city) && (
              <section className="px-7 py-8">
                <SectionHeader icon={Heart} label="Personal" color="#be185d" />
                <div className="rounded-2xl p-2 bg-[#FFF5F9] dark:bg-[#130008] border border-[#FFD6E8] dark:border-[#22000F] overflow-hidden">
                  <InfoRow label="Hobbies"  value={member.hobbies} />
                  <InfoRow label="Fun fact" value={member.personalNote} />
                  <InfoRow label="City"     value={member.city} />
                </div>
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <section className="px-7 py-8">
                <SectionHeader icon={Sparkles} label="Gallery" color="#0369a1" />
                <div className="grid grid-cols-2 gap-2.5">
                  {gallery.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(src)}
                      className="aspect-square rounded-xl overflow-hidden border border-[#E0E8F4] dark:border-[#1A2840] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A2B6B]"
                    >
                      <img
                        src={src}
                        alt={`Gallery image ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

          </div>{/* end right col */}
        </div>{/* end grid */}
      </div>{/* end outer card */}
    </div>
  )
}