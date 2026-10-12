#!/usr/bin/env bash
set -euo pipefail
BASE="$(cd "$(dirname "$0")" && pwd)/assets/audio"
mkdir -p "$BASE"
make_clip() {
 name="$1"; voice="$2"; speed="$3"; pitch="$4"; text="$5"
 espeak -v "$voice" -s "$speed" -p "$pitch" -a 160 -w "$BASE/$name.raw.wav" "$text" 2>/dev/null
 ffmpeg -loglevel error -y -i "$BASE/$name.raw.wav" -af "highpass=f=120,lowpass=f=3400,acompressor=threshold=-24dB:ratio=2.5:attack=5:release=130,volume=1.5" -c:a libvorbis -q:a 3 "$BASE/$name.ogg"
 rm -f "$BASE/$name.raw.wav"
}
make_clip nathaniel-call en-us+m3 120 25 "Evelyn? Oh, good. You're still awake. Don't look out the front, sweetheart. I'm at the back."
make_clip nathaniel-darling en-us+m3 108 22 "Evelyn, darling. I would hate for you to be frightened. Unlock the door."
make_clip nathaniel-window en-us+m3 114 26 "The curtains are open, Evelyn. You know I can see you."
make_clip gloria en-us+f4 131 55 "The electrician was such a pleasant young man. I left the extra house key on the counter for him."
make_clip april en-us+f3 158 63 "Evelyn? Call the police. Lock every entrance. I am not leaving you alone in this."
make_clip deputy en-us+m2 123 37 "Stay inside, Evelyn. Tell me his name and do not approach him. We are sending a unit."
make_clip nathaniel-scream en-us+m3 95 64 "EVELYN!"
echo 'Generated offline voice clips:'
ls -lh "$BASE"
