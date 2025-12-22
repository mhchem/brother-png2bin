# brother-png2bin.js

Use Brother label printers (QL-710W, QL-720NW, QL-820NWB, TD-2020, TD-2020A, TD-2120N, TD-2125N, TD-2125NWB, TD-2130N, TD-2135N, TD-2135NWB, TD-4210D, TD-4410D, TD-4420DN, TD-4520DN, TD-4550DNWB) without a driver on any operation system.\
Command-line tool (node.js) to convert a PNG file into a BIN file that Brother label printers can print.

## Supported Devices

Devices with Mass Storage Mode

Device | dpi | Support Status
--|--|--
Brother QL-710W | 300 dpi | ✅
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

## Libraries
Requires npm module pngjs

## Usage

`node brother-qt-png2bin <input.png> <output.bin>`

## Printer Usage

- Printer is off for a few seconds
- Printer is connected via USB
- QL-700, QL710W, QL-720NW
  - Press and hold the WiFi button, then press and hold the Power button
  - Wait a few seconds until WiFi and Power LED light up
- QL-820NWB, TD-4550DNWB
  - Press and hold the OK button, then press and hold the Power button
  - Wait a few seconds until "Mass Storage Mode" appears on the LCD
- TD-2130N
  - Press and hold the Print button, then press and hold the Power button
  - The Power LED lights in orange
- TD-4520DN
  - Press and hold the Function button (right-most button), then press the Power button
  - The Power LED lights in green
- Release the buttons
- The printer is now a mass storage drive
- Copy the BIN file to the drive (or use `brother-qt-png2bin` to directly write to the drive)
- Press WiFi/OK/Function button to print all files that exist on the drive