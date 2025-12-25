# brother-png2bin.js

Use Brother label printers (QL-710W, QL-720NW, QL-820NWB, TD-2020, TD-2020A, TD-2120N, TD-2125N, TD-2125NWB, TD-2130N, TD-2135N, TD-2135NWB, TD-4210D, TD-4410D, TD-4420DN, TD-4520DN, TD-4550DNWB) without a driver on any operation system.\
Command-line tool (node.js) to convert a PNG file into a BIN file that Brother label printers can print.

## Supported Devices

Devices with Mass Storage Mode

Device | dpi | Support Status
--|--|--
Brother QL-710W | 300 dpi | ✅ Tested
Brother QL-720NW | 300 dpi | Not tested
Brother QL-820NWB | 300 dpi | Not tested
Brother TD-2020 | 203 dpi | Not tested
Brother TD-2020A | 203 dpi | Not tested
Brother TD-2120N | 203 dpi | Not tested
Brother TD-2125N | 203 dpi | Not tested
Brother TD-2125NWB | 203 dpi | Not tested
Brother TD-2130N | 300 dpi | Not tested
Brother TD-2135N | 300 dpi | Not tested
Brother TD-2135NWB | 300 dpi | Not tested
Brother TD-4210D | 203 dpi | Not tested
Brother TD-4410D | 203 dpi | Not tested
Brother TD-4420DN | 203 dpi | Not tested
Brother TD-4520DN | 300 dpi | Not tested
Brother TD-4550DNWB | 300 dpi | Not tested

If you successfully used one of the printers above, please tell me.

If you have a Brother printer with Mass Storage Mode that is not listed above, please create an issue.

## Libraries
Requires npm module pngjs

## Usage

- Create a PNG with correct dimensions
  - 12 mm wide tape, 300 dpi printer: Required PNG dimension 142 px.
  - 29 mm wide tape, 300 dpi printer: Required PNG dimension 342 px.
  - 38 mm wide tape, 300 dpi printer: Required PNG dimension 449 px.
  - 50 mm wide tape, 300 dpi printer: Required PNG dimension 590 px.
  - 54 mm wide tape, 300 dpi printer: Required PNG dimension 636 px.
  - 62 mm wide tape, 300 dpi printer: Required PNG dimension 732 px.
  - 57 mm wide tape, 300 dpi printer: Required PNG dimension 675 px.
  - 57 mm wide tape, 203 dpi printer: Required PNG dimension 457 px.
  - 58 mm wide tape, 300 dpi printer: Required PNG dimension 685 px.
  - 58 mm wide tape, 203 dpi printer: Required PNG dimension 464 px.
  - 76 mm wide tape, 300 dpi printer: Required PNG dimension 897 px.
  - 76 mm wide tape, 203 dpi printer: Required PNG dimension 607 px.
  - 90 mm wide tape, 300 dpi printer: Required PNG dimension 1063 px.
  - 90 mm wide tape, 203 dpi printer: Required PNG dimension 719 px.
  - 102 mm wide tape, 300 dpi printer: Required PNG dimension 1200 px.
  - 102 mm wide tape, 203 dpi printer: Required PNG dimension 812 px.
- Convert PNG to BIN
  - `node brother-qt-png2bin <input.png> <output.bin>`
- Copy BIN file to printer and print (see below)

## Printer Usage

- Printer has been off for a few seconds
- Printer is connected via USB
- QL-7xx
  - Press and hold the WiFi button, then press and hold the Power button
  - Wait a few seconds until WiFi and Power LED light up
- QL-8xx, TD-4550DNWB
  - Press and hold the OK button, then press and hold the Power button
  - Wait a few seconds until "Mass Storage Mode" appears on the LCD
- TD-2xxx
  - Press and hold the Print button, then press and hold the Power button
  - The Power LED lights in orange
- TD-4xxxx
  - Press and hold the Function button (right-most button), then press the Power button
  - The Power LED lights in green
- Release the buttons
- The printer is now a mass storage drive
- Copy the BIN file to the drive (or use `brother-qt-png2bin` to directly write to the drive)
- Press WiFi/OK/Print/Function button to print all files that exist on the drive
