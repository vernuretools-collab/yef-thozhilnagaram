import { useNavigate } from 'react-router-dom'
import { Globe, Mail, Smartphone } from 'lucide-react'
import Badge from './Badge'

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

const formatCleanBio = (member) => {
  const name = (member.name || '').trim().toLowerCase()
  const company = (member.business || member.company || '').trim().toLowerCase()
  let bio = (member.bio || '').trim()

  // If bio is missing or is just repeating name/company
  if (!bio || bio.toLowerCase() === name || bio.toLowerCase() === company) {
    return 'A Tamil professional building community, opportunity, and impact.'
  }

  // Take only the first paragraph/sentence before any line breaks
  let clean = bio.split(/[\r\n]+/)[0].trim()

  // Clean out SEO keyword dumps (e.g. "Auditor in Chennai Best Auditor in Chennai...")
  if (/Auditor in Chennai|GST Consultant|Tax Auditor|Chartered Accountant in Chennai/i.test(bio)) {
    clean = 'Paramount Associates is a professional auditing and financial consultancy firm offering accounting, tax, and audit services.'
  }

  // Strip any trailing keyword lists if concatenated into the string
  const keywordIndex = clean.search(/Auditor in Chennai|Best Auditor|Chartered Accountant|CA Firm in Chennai/i)
  if (keywordIndex > 0) {
    clean = clean.slice(0, keywordIndex).trim()
  }

  return clean
}

export default function MemberCard({ member }) {
  const navigate = useNavigate()
  const profileId = member.uid || member.id
  const initials = getInitials(member.name)
  const category = member.industry ? member.industry.trim() : ''
  const company = member.business || member.company || ''
  const headline = formatCleanBio(member)
  const tags = Array.isArray(member.tags) ? member.tags : []
  const avatar = member.photoURL || member.avatarUrl || ''

  const email = member.email || member.contactEmail || ''
  const phone = member.phone || member.phoneNumber || member.mobile || member.contactNo || ''
  const cleanPhone = phone ? phone.replace(/\D/g, '') : ''
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : ''

  function openProfile() {
    if (profileId) navigate(`/members/${profileId}`)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openProfile}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openProfile()
        }
      }}
      aria-label={`View ${member.name || 'member'} profile`}
      className="group relative bg-white dark:bg-[#13192e] border border-[#E8ECF8] dark:border-[#2a3460] rounded-2xl overflow-hidden shadow-[0_6px_18px_rgba(26,43,107,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(26,43,107,0.12)] hover:border-[#1A2B6B]/30 dark:hover:border-[#8899d4]/30 transition-all duration-200 flex flex-col justify-between h-full cursor-pointer"
    >
      {/* Top subtle accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1A2B6B] via-[#D0021B] to-[#1A2B6B] opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header: Avatar + Info */}
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-[#F5F6FA] dark:bg-[#1c2340] border-2 border-[#E8ECF8] dark:border-[#2a3460] shadow-sm">
              {avatar ? (
                <img
                  src={avatar}
                  alt={member.name || 'Member'}
                  className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full grid place-items-center bg-gradient-to-br from-[#1A2B6B] to-[#0D1636] text-white font-black text-lg sm:text-xl tracking-wider">
                  {initials}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className="text-lg sm:text-xl font-bold text-[#13245a] dark:text-[#F3F6FF] leading-tight truncate group-hover:text-[#D0021B] dark:group-hover:text-[#FF8E9A] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
              >
                {member.name || 'Member'}
              </h3>

              {category ? (
                <p className="mt-1 text-xs sm:text-sm font-bold text-[#D0021B] dark:text-[#FF8E9A] truncate uppercase tracking-wider">
                  {category}
                </p>
              ) : (
                <p className="mt-1 text-xs font-semibold text-[#7A86A8] dark:text-[#7A8FAB] truncate">
                  Member
                </p>
              )}

              {company && (
                <p className="mt-0.5 text-xs font-medium text-[#667085] dark:text-[#B6C2E2] truncate">
                  {company}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 h-px bg-[#EEF2FB] dark:bg-[#22304D]" />

          {/* Short 2-line Bio Preview */}
          <p className="mt-4 text-sm leading-relaxed text-[#4B5563] dark:text-[#DCE5F8] line-clamp-2">
            {headline}
          </p>
        </div>

        <div>
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tags.slice(0, 3).map(t => (
                <Badge key={t} color="gray">
                  {t}
                </Badge>
              ))}
              {tags.length > 3 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F6FA] dark:bg-[#1c2340] border border-[#E8ECF8] dark:border-[#2a3460] text-[#667085] dark:text-[#B6C2E2]">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action / Contact Footer Bar */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#EEF2FB] dark:border-[#22304D]">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Email Icon - Always Visible */}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  title={`Email: ${email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA] dark:bg-[#1c2340] text-[#1A2B6B] dark:text-[#8899d4] hover:bg-[#D0021B] hover:text-white dark:hover:bg-[#D0021B] dark:hover:text-white transition-colors shrink-0"
                  aria-label={`Email ${member.name || 'Member'}`}
                >
                  <Mail size={15} />
                </a>
              ) : (
                <span
                  title="Email not provided in profile"
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA]/60 dark:bg-[#1c2340]/60 text-[#9AA3BF]/40 dark:text-[#667085]/40 cursor-not-allowed shrink-0"
                  aria-label="Email not provided"
                >
                  <Mail size={15} />
                </span>
              )}

              {/* Smartphone / WhatsApp Icon - Always Visible */}
              {phone ? (
                <a
                  href={whatsappUrl || `tel:${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Chat on WhatsApp: ${phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA] dark:bg-[#1c2340] text-[#059669] dark:text-[#34D399] hover:bg-[#25D366] hover:text-white dark:hover:bg-[#25D366] dark:hover:text-white transition-colors shrink-0"
                  aria-label={`WhatsApp chat with ${member.name || 'Member'}`}
                >
                  <Smartphone size={15} />
                </a>
              ) : (
                <span
                  title="WhatsApp / Phone not provided in profile"
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA]/60 dark:bg-[#1c2340]/60 text-[#9AA3BF]/40 dark:text-[#667085]/40 cursor-not-allowed shrink-0"
                  aria-label="WhatsApp not provided"
                >
                  <Smartphone size={15} />
                </span>
              )}

              {/* Website Icon (if present) */}
              {member.website && (
                <a
                  href={member.website.startsWith('http') ? member.website : `https://${member.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Website: ${member.website}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA] dark:bg-[#1c2340] text-[#9AA3BF] hover:text-[#1A2B6B] dark:hover:text-[#8899d4] hover:bg-[#E8ECF8] dark:hover:bg-[#252f52] transition-colors shrink-0"
                  aria-label="Website"
                >
                  <Globe size={15} />
                </a>
              )}

              {/* LinkedIn Icon (if present) */}
              {member.linkedin && (
                <a
                  href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn Profile"
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full grid place-items-center bg-[#F5F6FA] dark:bg-[#1c2340] text-[#0A66C2] dark:text-[#60A5FA] hover:bg-[#0A66C2] hover:text-white transition-colors shrink-0"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}