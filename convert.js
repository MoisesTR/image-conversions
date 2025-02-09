const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const heicConvert = require('heic-convert');

(async () => {
  const inputDir = path.join(__dirname, 'input');
  const outputDir = path.join(__dirname, 'output');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    if (ext === '.heic') {
      const inputFilePath = path.join(inputDir, file);
      let baseName = path.basename(file, ext);

      baseName = baseName.replace(/[-_]?.heic/gi, '');

      const outputFilePath = path.join(outputDir, `${baseName}.jpg`);

      try {
        const inputBuffer = fs.readFileSync(inputFilePath);
        const jpegBuffer = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.8,
        });

        await sharp(jpegBuffer)
          .resize({
            width: 1200, // Max width (maintains aspect ratio)
            withoutEnlargement: true,
          })
          .jpeg({ quality: 70 })
          .toFile(outputFilePath);

        console.log(`✅ Converted: ${file} → ${baseName}.jpg`);
      } catch (err) {
        console.error(`❌ Error processing file ${file}:`, err);
      }
    }
  }
})();
