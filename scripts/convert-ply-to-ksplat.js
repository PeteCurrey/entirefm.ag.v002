const fs = require('fs');
const path = require('path');
const GaussianSplats3D = require('@mkkellogg/gaussian-splats-3d');

async function convert() {
  console.log('Reading PLY file...');
  const inputPath = path.resolve(__dirname, '../Guassian Splat/04_05_2026.ply');
  const outputDir = path.resolve(__dirname, '../public/assets/gaussian-splats');
  const outputPath = path.join(outputDir, '04_05_2026.ksplat');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const plyBuffer = fs.readFileSync(inputPath);
  const arrayBuffer = plyBuffer.buffer.slice(plyBuffer.byteOffset, plyBuffer.byteOffset + plyBuffer.byteLength);
  console.log(`Loaded PLY (${(arrayBuffer.byteLength / (1024 * 1024)).toFixed(2)} MB). Parsing to uncompressed splat array...`);

  const splatArray = GaussianSplats3D.PlyParser.parseToUncompressedSplatArray(arrayBuffer);
  console.log(`Parsed ${splatArray.splatCount} splats. Generating KSplat buffer with compressionLevel=1...`);

  // compressionLevel: 1 = standard KSplat compression (50-70% size reduction with full SH fidelity)
  const generator = GaussianSplats3D.SplatBufferGenerator.getStandardGenerator(1, 1, 0);
  const splatBuffer = generator.generateFromUncompressedSplatArray(splatArray);

  const ksplatData = Buffer.from(splatBuffer.bufferData);
  fs.writeFileSync(outputPath, ksplatData);
  console.log(`Successfully generated KSplat! Output saved to: ${outputPath} (${(ksplatData.length / (1024 * 1024)).toFixed(2)} MB)`);
}

convert().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
