import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const cartoonDirectory = path.join(process.cwd(), 'public', 'editorial-cartoons')
const files = (await readdir(cartoonDirectory)).filter((file) => /\.jpe?g$/i.test(file))
const failures = []

for (const file of files) {
  const filePath = path.join(cartoonDirectory, file)
  const image = await readFile(filePath)

  if (image.length > 782_000) {
    failures.push(`${file}: ${image.length} bytes exceeds the safe 782 KB upload limit`)
  }

  const hasJpegStart = image[0] === 0xff && image[1] === 0xd8
  if (!hasJpegStart) {
    failures.push(`${file}: invalid JPEG start marker`)
  }
}

if (failures.length > 0) {
  console.error('Cartoon validation failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Validated ${files.length} editorial cartoon images.`)
