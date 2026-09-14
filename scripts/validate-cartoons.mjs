import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const cartoonDirectory = path.join(process.cwd(), 'public', 'editorial-cartoons')
const files = (await readdir(cartoonDirectory)).filter((file) => /\.(jpe?g|png)$/i.test(file))
const failures = []

for (const file of files) {
  const filePath = path.join(cartoonDirectory, file)

  try {
    const image = sharp(filePath, { failOn: 'warning' })
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height || metadata.width < 800 || metadata.height < 500) {
      failures.push(`${file}: unexpected dimensions`)
      continue
    }

    const bottomHeight = Math.max(1, Math.floor(metadata.height * 0.35))
    const { channels } = await sharp(filePath, { failOn: 'warning' })
      .extract({ left: 0, top: metadata.height - bottomHeight, width: metadata.width, height: bottomHeight })
      .greyscale()
      .stats()

    if (channels[0].stdev < 2) {
      failures.push(`${file}: lower 35% is blank or a flat colour`)
    }
  } catch (error) {
    failures.push(`${file}: ${error instanceof Error ? error.message : 'invalid image'}`)
  }
}

if (failures.length > 0) {
  console.error('Cartoon validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Validated ${files.length} editorial cartoon images.`)
