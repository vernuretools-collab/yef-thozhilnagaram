export const SITE_ORIGIN = 'https://thozhilnagaram.yef-network.com'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (!href) return
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function siteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return SITE_ORIGIN
}

export function absoluteUrl(path = '/') {
  const origin = siteOrigin()
  if (!path) return origin
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function setSeo({ title, description, path, image, type = 'profile' } = {}) {
  if (title) document.title = title
  if (description) upsertMeta('name', 'description', description)

  const url = absoluteUrl(path)
  upsertCanonical(url)

  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:site_name', 'Yaam Economic Forum')
  if (image) upsertMeta('property', 'og:image', image)

  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  if (image) upsertMeta('name', 'twitter:image', image)
}

const JSON_LD_ID = 'yef-member-jsonld'

export function setJsonLd(data) {
  let el = document.getElementById(JSON_LD_ID)
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = JSON_LD_ID
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function clearJsonLd() {
  document.getElementById(JSON_LD_ID)?.remove()
}
