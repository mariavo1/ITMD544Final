import prisma from '../src/utils/prisma'

const location = {
  label: 'Chicago, US',
  latitude: 41.88,
  longitude: -87.62,
}

function seedLocation(location: any) {
  const data = {
    label: location.label,
    latitude: location.latitude,
    longitude: location.longitude,
  }

  prisma.location
    .create({ data })
    .then(() => console.info('[SEED] Successfully created location record'))
    .catch((e) => console.error('[SEED] Failed to create location record', e))
}

seedLocation(location)
