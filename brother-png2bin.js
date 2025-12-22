// brother-png2bin.js
// Use Brother label printers (QL-710W, QL-720NW) without a driver on any operation system. \
// Command-line tool (node.js) to convert a PNG file into a BIN file that Brother label printers can print.

// v1.0.0 2025-12-22

// MIT No Attribution
// 
// Copyright 2025  M.a.r.t.i.n  H.e.n.s.e.l
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const fs = require('fs');
const { PNG } = require('pngjs');
let png, outfile;

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: brother-qt-png2bin <png-file> <output-bin-file>');
  // Will stop at !tapeSize
} else {
  const inFile = args[0];
  outFile = args[1];

  const pngBuffer = fs.readFileSync(inFile);
  png = PNG.sync.read(pngBuffer);
}

// Technical References
//   https://download.brother.com/welcome/docp000698/cv_ql600710720_eng_raster_102.pdf
//   https://download.brother.com/welcome/docp100278/cv_ql800_eng_raster_101.pdf
//   https://download.brother.com/welcome/docp000750/cv_td2000_eng_raster_101.pdf
//   https://download.brother.com/welcome/docp100429/cv_td4000d_eng_raster_102.pdf
const tapeSizes = [
  { mm: 12, px: 142, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 29, px: 342, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 38, px: 449, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 50, px: 590, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 54, px: 636, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 62, px: 732, dpi: 300, minMargin: 35, minLength: 150 },  // QL-7xx
  { mm: 57, px: 675, dpi: 300, minMargin: 35, minLength: 142 },  // TL-2xxx
  { mm: 58, px: 685, dpi: 300, minMargin: 35, minLength: 142 },  // TL-2xxx
  { mm: 57, px: 457, dpi: 203, minMargin: 24, minLength: 96 },  // TL-2xxx
  { mm: 58, px: 464, dpi: 203, minMargin: 24, minLength: 96 },  // TL-2xxx
  { mm: 58, px: 685, dpi: 300, minMargin: 35, minLength: 142 },  // TD-4xxx
  { mm: 76, px: 897, dpi: 300, minMargin: 35, minLength: 142 },  // TD-4xxx
  { mm: 90, px: 1063, dpi: 300, minMargin: 35, minLength: 142 },  // TD-4xxx
  { mm: 102, px: 1200, dpi: 300, minMargin: 35, minLength: 142 },  // TD-4xxx
  { mm: 58, px: 464, dpi: 203, minMargin: 24, minLength: 96 },  // TD-4xxx
  { mm: 76, px: 607, dpi: 203, minMargin: 24, minLength: 96 },  // TD-4xxx
  { mm: 90, px: 719, dpi: 203, minMargin: 24, minLength: 96 },  // TD-4xxx
  { mm: 102, px: 812, dpi: 203, minMargin: 24, minLength: 96 },  // TD-4xxx
];



let tapeSize;
if (png && png.height) {
  tapeSizes.forEach(t => {
    if (t.px === png.height) {
      tapeSize = t;
    }
  });
  if (!tapeSize) {
    console.error('PNG height does not fit.');
    // Will stop at !tapeSize
  }
}
if (!tapeSize) {
  console.error('Allowed PNG dimensions:');
  tapeSizes.forEach(t => {
    console.error(`  ${t.mm} mm wide tape, ${t.dpi} dpi printer: PNG height of ${t.px} px.`);
  })
  process.exit(1);
}

// Maximum length 1000 mm = 7992 dots 203 dpi (Some printers allow more, but who wants to print that.)
if (png.width > 7992) {
  console.error('PNG must be at most 7992 pixels wide.');
  process.exit(1);
}



let raster = [];
let rasterLength = 0;
let ignoredMarginPixels = false;
const xShiftToMinLength = Math.max(0, Math.ceil(((tapeSize.minLength + 2 * tapeSize.minMargin) - png.width) / 2));
const yShiftToCenter = Math.round((tapeSize.px - png.height) / 2);  // Not used at the moment, as we only accept PNGs with perfect height
for (let x = 0; x < png.width - 1 + 2 * xShiftToMinLength; x++) {
  let inMargin = false;
  if (x < tapeSize.minMargin || x > 2 * xShiftToMinLength + png.width - tapeSize.minMargin - 1) {
    inMargin = true;
  }
  if (!inMargin) {
    raster.push(0x67);
    raster.push(0x00);
    raster.push(Math.ceil(tapeSize.px / 8));
  }
  let byte = 0;
  let y;
  for (y = 0; y < Math.ceil(tapeSize.px / 8) * 8; y++) {
    if (xShiftToMinLength <= x && x < xShiftToMinLength + png.width && yShiftToCenter <= y && y < yShiftToCenter + png.height) {
      let idx = (png.width * (y - yShiftToCenter) + (x - xShiftToMinLength)) << 2;
      byte = byte | (0.299 * png.data[idx] + 0.587 * png.data[idx + 1] + 0.114 * png.data[idx + 2] < 128 ? 1 : 0) << (7 - (y % 8));
    }
    if ((y % 8) === 7) {  // 8 bits collected
      if (inMargin) {
        ignoredMarginPixels ||= byte;
      } else {
        raster.push(byte);
        rasterLength += 1;
      }
      byte = 0;
    }
  }
}


let out = [];
// Initialize
out.push(...[0x1B, 0x40]);
// Raster Mode
out.push(...[0x1B, 0x69, 0x61, 0x01]);
// Sets the print information for the printer.
out.push(...[0x1B, 0x69, 0x7A]);
out.push(0b11000010); // Bit mask: 0x02: Media type, 0x04: Media width [We don't set this bit, so the printer does not check for compatibility and will always print], 0x40 : Priority g ive n to print quality, 0x80: Printer recovery always on
out.push(0x0A); // Continuous length tape
out.push(...[tapeSize.mm, 0x00]);  // Media width in mm, Media length
out.push(...(new Uint8Array([rasterLength & 0xFF, (rasterLength >> 8) & 0xFF, (rasterLength >> 16) & 0xFF, (rasterLength >> 24) & 0xFF])));  // Raster Size
out.push(...[0x00, 0x00]);
// Auto Cut On
out.push(...[0x1B, 0x69, 0x4D, 0x40]);
out.push(...[0x1B, 0x69, 0x41, 0x01]);
out.push(...[0x1B, 0x69, 0x4B, 0x08]);
// Minimum margins before and after: 3 mm = 35 dots (300dpi)
out.push(...[0x1B, 0x69, 0x64, tapeSize.minMargin, 0x00]);
// No compression
out.push(...[0x4D, 0x00]);
// RASTER DATA
out = out.concat(raster);
// Print command with feeding, Used as a print command at the end of the last page.
out.push(0x1A);
// Resets the command mode of the printer to default mode.
out.push(...[0x1B, 0x69, 0x61, 0xFF]);


const buffer = Buffer.from(out);
fs.writeFileSync(outFile, buffer);


console.log(`Created bin file for Brother label printer at ${outFile}`);
console.log(`> Continuous length tape ${tapeSize.mm} mm, length: ${Math.round((2 * xShiftToMinLength + png.width) / tapeSize.dpi * 25.4 * 10) / 10} mm (${tapeSize.dpi} dpi).`);
console.log(`> PNG ${png.width} x ${png.height} px, tape print ${2 * xShiftToMinLength + png.width} x ${tapeSize.px} px.`);
if (ignoredMarginPixels) {
  console.log(`> Ignored pixels in 3 mm begin/end margin.`);
}
if (xShiftToMinLength !== 0) {
  console.log(`> Horiztonally centered to reach minimum length.`);
}
if (yShiftToCenter !== 0) {
  console.log(`> Vertically centered because PNG height ${png.height} px < tape width ${tapeSize.px} px.`);
}
console.log('(Press and hold WiFi/OK/Print/Function + Power until LEDs light up.)');
console.log('(Then copy bin file to mass storage drive.');
console.log('(Then press WiFi/OK/Print/Function to print.)');
