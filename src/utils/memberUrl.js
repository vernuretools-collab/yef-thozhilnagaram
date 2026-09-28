const UID_RE = /^[A-Za-z0-9]{20,128}$/

export function slugifyName(name = '') {
  return String(name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function memberProfilePath(member) {
  const id = member?.uid || member?.id
  if (!id) return '/members'
  const slug = slugifyName(member?.name)
  return slug ? `/members/${slug}-${id}` : `/members/${id}`
}

export function memberIdFromParam(param = '') {
  if (!param) return ''
  if (UID_RE.test(param)) return param
  const match = String(param).match(/-([A-Za-z0-9]{20,128})$/)
  return match ? match[1] : ''
}
