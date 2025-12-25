// brother-png2bin.js
// Use Brother label printers (QL-710W, QL-720NW) without a driver on any operation system. \
// Command-line tool (node.js) to convert a PNG file into a BIN file that Brother label printers can print.

// v1.2.0 2025-12-24

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
let png, inFile, outFile;
let isTiffCompressed = false;

const args = process.argv.slice(2);
let argStatus = 0;
for (a of args) {
	if (a === '-c0') {
		isTiffCompressed = false;
	} else if (a === '-c1') {
		isTiffCompressed = true;
	} else if (argStatus === 0) {
		inFile = a;
		argStatus = 1;
	} else if (argStatus === 1) {
		outFile = a;
		argStatus = 2;
	} else {
		argStatus = 999;
	}
}
if (!inFile || !outFile || argStatus === 999) {
	console.error('Usage: brother-qt-png2bin [option] <png-file> <output-bin-file>');
	// console.error('  -c0  without compression');
	// console.error('  -c1  with TIFF compression');
	// Will stop at !tapeSize
} else {
	console.log(` * Reading ${inFile}.`)
	const pngBuffer = fs.readFileSync(inFile);
	png = {};
	png.orig = PNG.sync.read(pngBuffer);
}

// Technical References
//   https://download.brother.com/welcome/docp000698/cv_ql600710720_eng_raster_102.pdf
//   https://download.brother.com/welcome/docp100278/cv_ql800_eng_raster_101.pdf
//   https://download.brother.com/welcome/docp000750/cv_td2000_eng_raster_101.pdf
//   https://download.brother.com/welcome/docp100429/cv_td4000d_eng_raster_102.pdf
const tapeSizes = [
	{ mm: 12, px: 142, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 29, px: 342, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 38, px: 449, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 50, px: 590, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 54, px: 636, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 62, px: 732, dpi: 300, lineSizeTiff: 90, minMargin: 35, minLength: 150 },  // QL-7xx
	{ mm: 57, px: 675, dpi: 300, lineSizeTiff: 84, minMargin: 35, minLength: 142 },  // TL-2xxx
	{ mm: 58, px: 685, dpi: 300, lineSizeTiff: 84, minMargin: 35, minLength: 142 },  // TL-2xxx
	{ mm: 57, px: 457, dpi: 203, lineSizeTiff: 56, minMargin: 24, minLength: 96 },  // TL-2xxx
	{ mm: 58, px: 464, dpi: 203, lineSizeTiff: 56, minMargin: 24, minLength: 96 },  // TL-2xxx
	{ mm: 58, px: 685, dpi: 300, lineSizeTiff: 160, minMargin: 35, minLength: 142 },  // TD-4xxx
	{ mm: 76, px: 897, dpi: 300, lineSizeTiff: 160, minMargin: 35, minLength: 142 },  // TD-4xxx
	{ mm: 90, px: 1063, dpi: 300, lineSizeTiff: 160, minMargin: 35, minLength: 142 },  // TD-4xxx
	{ mm: 102, px: 1200, dpi: 300, lineSizeTiff: 160, minMargin: 35, minLength: 142 },  // TD-4xxx
	{ mm: 58, px: 464, dpi: 203, lineSizeTiff: 104, minMargin: 24, minLength: 96 },  // TD-4xxx
	{ mm: 76, px: 607, dpi: 203, lineSizeTiff: 104, minMargin: 24, minLength: 96 },  // TD-4xxx
	{ mm: 90, px: 719, dpi: 203, lineSizeTiff: 104, minMargin: 24, minLength: 96 },  // TD-4xxx
	{ mm: 102, px: 812, dpi: 203, lineSizeTiff: 104, minMargin: 24, minLength: 96 },  // TD-4xxx
];


let tapeSize;
if (png) {
	console.log(` * PNG has ${png.orig.width} x ${png.orig.height} px.`);
	tapeSizes.forEach(t => {
		if (t.px === png.orig.width) {
			tapeSize = t;
			png.width = png.orig.width;
			png.height = png.orig.height;
			png.pixel = function(x, y) {
				let idx = (png.orig.width * y + png.orig.width - x - 1) << 2;
				return [png.orig.data[idx], png.orig.data[idx + 1], png.orig.data[idx + 2]];
			}
			console.log(` * Printing PNG top edge first (${png.width} dots).`)
		}
	});
	if (!tapeSize) {
		tapeSizes.forEach(t => {
			if (t.px === png.orig.height) {
				tapeSize = t;
				png.width = png.orig.height;
				png.height = png.orig.width;
				png.pixel = function(x, y) {
				let idx = (png.orig.width * x + y) << 2;
				return [png.orig.data[idx], png.orig.data[idx + 1], png.orig.data[idx + 2]];
				}
				console.log(` * Printing PNG left edge first (${png.width} dots).`)
			}
		});
	}
	if (!tapeSize) {
		console.error('PNG height or width does not fit.');
		// Will stop at !tapeSize
	}
}
if (!tapeSize) {
	console.error('Allowed PNG dimensions:');
	tapeSizes.forEach(t => {
		console.error(`  ${t.mm} mm wide tape, ${t.dpi} dpi printer: Required PNG dimension ${t.px} px.`);
	})
	process.exit(1);
}

// Maximum length 1000 mm = 7992 dots 203 dpi (Some printers allow more, but who wants to print that.)
if (png.width > 7992) {
	console.error('PNG must be at most 7992 pixels wide.');
	process.exit(1);
}


let raster = [];
const lineSize = isTiffCompressed ? tapeSize.lineSizeTiff : Math.ceil(tapeSize.px / 8);

for (let y = 0; y < png.height; y++) {
	let line = [];
	let byte = 0;
	for (let x = 0; x < lineSize * 8; x++) {
		if (x < png.width) {
			let p = png.pixel(x, y);
			byte = byte | (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] < 128 ? 1 : 0) << (7 - (x % 8));
		}
		if ((x % 8) === 7) {  // 8 bits collected
			line.push(byte);
			byte = 0;
		}
	}
	if (!isTiffCompressed) {
		raster.push(line);
	} else {
		// TIFF compression
		let lineTiff = [];
		let i = 0;
		while (i < line.length) {
			let count = 1;
			// Identicals
			while (i + count < line.length && line[i] === line[i + count] && count < 128) {
				count++;
			}
			if (count > 1) {
				// Identicals
				lineTiff.push(1 - count);
				lineTiff.push(line[i]);
				i += count;
			} else {
				// Non-identicals
				while (i + count < line.length && line[i + count - 1] !== line[i + count] && count < 128 && (i + count + 1 === line.length || line[i + count] !== line[i + count + 1])) {
					count++;
				}
				lineTiff.push(count - 1);
				for (let j = 0; j < count; j++) {
						lineTiff.push(line[i + j]);
				}
				i += count;
			}
		}
		if (lineTiff.length === 2 && lineTiff[1] === 0) {
			raster.push(0x5A);  // Empty line
		} else {
			raster.push(lineTiff);
		}
	}
}

let marginPixels = tapeSize.minMargin;
while (marginPixels > 0 && raster.length >= 2 && 0 === raster[0].reduce((a, b) => a + b) && 0 === raster[raster.length - 1].reduce((a, b) => a + b)) {
	raster = raster.slice(1, -1);
	marginPixels--;
}
if (marginPixels > 0) {
	console.log('!! Extending print area as there are black pixels in the non-printable margins.')
}

if (raster.length < tapeSize.minLength) {
	console.log('!! Extending print area to reach the minimum print length.');
	let size = Math.ceil((tapeSize.minLength - raster.length) / 2);
	raster = (new Array(size).fill(new Array(lineSize).fill(0))).concat(raster);
	raster = raster.concat(new Array(size).fill(new Array(lineSize).fill(0)));
}

console.log(`>> Continuous length tape ${tapeSize.mm} mm, length: ${Math.round((png.width) / tapeSize.dpi * 25.4 * 10) / 10} mm (${tapeSize.dpi} dpi).`);
console.log(`>> Tape print area ${raster.length + 2 * tapeSize.minMargin} x ${lineSize * 8} dots = data for ${raster.length} x ${lineSize * 8} dots without margins.`);


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
out.push(...(new Uint8Array([raster.length & 0xFF, (raster.length >> 8) & 0xFF, (raster.length >> 16) & 0xFF, (raster.length >> 24) & 0xFF])));  // Raster Size
out.push(...[0x00, 0x00]);
// Auto Cut On
out.push(...[0x1B, 0x69, 0x4D, 0x40]);
out.push(...[0x1B, 0x69, 0x41, 0x01]);
out.push(...[0x1B, 0x69, 0x4B, 0x08]);
// Minimum margins before and after: 3 mm = 35 dots (300dpi)
out.push(...[0x1B, 0x69, 0x64, tapeSize.minMargin, 0x00]);
// Compression or not
out.push(...[0x4D, isTiffCompressed ? 0x02 : 0x00]);
// RASTER DATA
for (let line of raster) {
	out.push(0x67);
	out.push(0x00);
	out.push(line.length);
	out = out.concat(line);
}
// Print command with feeding, Used as a print command at the end of the last page.
out.push(0x1A);
// Resets the command mode of the printer to default mode.
out.push(...[0x1B, 0x69, 0x61, 0xFF]);


console.log(` * Writing bin file for Brother label printer at ${outFile}`);
const buffer = Buffer.from(out);
fs.writeFileSync(outFile, buffer);

console.log(' (Press and hold WiFi/OK/Print/Function + Power until LEDs light up.)');
console.log(' (Then copy bin file to mass storage drive.)');
console.log(' (Then press WiFi/OK/Print/Function to print.)');
