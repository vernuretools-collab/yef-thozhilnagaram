const OUTPUT_SIZE = 720
const JPEG_QUALITY = 0.9
const FACE_PAD = 1.85
const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_full_range/float16/latest/blaze_face_full_range.tflite'

let detectorPromise = null

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function upperCenterSquare(width, height) {
  const size = Math.min(width, height)
  const x = (width - size) / 2
  const y = clamp(height * 0.08, 0, height - size)
  return { x, y, size }
}

function paddedFaceSquare(box, width, height) {
  const cx = box.originX + box.width / 2
  const cy = box.originY + box.height / 2 - box.height * 0.08
  let size = Math.max(box.width, box.height) * FACE_PAD
  size = Math.min(size, width, height)

  const x = clamp(cx - size / 2, 0, width - size)
  const y = clamp(cy - size / 2, 0, height - size)
  return { x, y, size }
}

function largestFace(detections = []) {
  return detections.reduce((best, detection) => {
    const box = detection?.boundingBox
    if (!box) return best
    const area = box.width * box.height
    if (!best || area > best.area) return { box, area }
    return best
  }, null)?.box ?? null
}

async function fileToBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      return await createImageBitmap(file)
    }
  }

  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function getFaceDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision')
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)
      return FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.45,
      })
    })().catch((err) => {
      detectorPromise = null
      throw err
    })
  }

  return detectorPromise
}

function cropToCanvas(source, region) {
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    source,
    region.x,
    region.y,
    region.size,
    region.size,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  )
  return canvas
}

function canvasToJpegBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not encode cropped photo'))
          return
        }
        resolve(blob)
      },
      'image/jpeg',
      JPEG_QUALITY
    )
  })
}

export async function cropToFace(file) {
  const source = await fileToBitmap(file)
  const width = source.width
  const height = source.height

  let region = upperCenterSquare(width, height)

  try {
    const detector = await getFaceDetector()
    const { detections } = detector.detect(source)
    const face = largestFace(detections)
    if (face) region = paddedFaceSquare(face, width, height)
  } catch (err) {
    console.warn('Face detection unavailable, using upper-center crop', err)
  }

  const canvas = cropToCanvas(source, region)
  if (typeof source.close === 'function') source.close()
  return canvasToJpegBlob(canvas)
}
