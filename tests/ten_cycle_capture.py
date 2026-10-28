#!/usr/bin/env python3
"""Ten sequential legacy melonDS control/Etarium captures.
Only verifies whether screenshots differ from the observed blank white state;
a functional game test requires additional assertions and iPhone Delta testing.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from PIL import Image

emulator=Path(sys.argv[1]).resolve()
control=Path(sys.argv[2]).resolve()
subject=Path(sys.argv[3]).resolve()
out=Path(sys.argv[4]); out.mkdir(parents=True,exist_ok=True)
report=[]
def run_once(kind,rom,iteration):
    fn=out/f"{iteration:02d}_{kind}.png"
    script=r"""
"$1" "$2" >/dev/null 2>&1 &
pid=$!
sleep 4
wid="$(timeout 2s xdotool search --onlyvisible --name melonDS | head -n 1 || true)"
if [ -n "$wid" ]; then timeout -k 1s 4s import -window "$wid" "$3" >/dev/null 2>&1 || true; fi
kill -TERM "$pid" 2>/dev/null || true
exit 0
"""
    cmd=['timeout','-k','2s','15s','xvfb-run','-a','-s','-screen 0 1280x900x24',
         'bash','-c',script,'_',str(emulator),str(rom),str(fn.resolve())]
    done=subprocess.run(cmd,timeout=20,env={**os.environ,'QT_QPA_PLATFORM':'xcb','LIBGL_ALWAYS_SOFTWARE':'1','SDL_AUDIODRIVER':'dummy'})
    item={'iteration':iteration,'rom':kind,'process_exit':done.returncode,'capture':fn.name,'file_exists':fn.is_file()}
    if fn.is_file():
        im=Image.open(fn).convert('RGB')
        # Most of the window can be blank. Report only; do NOT infer gameplay success.
        pixels=list(im.getdata())
        white=sum(1 for rgb in pixels if min(rgb)>=245)
        item.update({'dimensions':list(im.size),'white_fraction':round(white/len(pixels),5),
                     'sha256':hashlib.sha256(fn.read_bytes()).hexdigest()})
    return item

for i in range(1,11):
    for name,path in [('upstream',control),('etarium',subject)]:
        item=run_once(name,path,i)
        report.append(item)
        (out/'results.json').write_text(json.dumps(report,indent=2))
        print(json.dumps(item),flush=True)
        if not item['file_exists'] or item['process_exit']!=0:
            (out/'status.txt').write_text(f"STOP at {i}: {name} screenshot/session failure\n")
            sys.exit(1)
(out/'status.txt').write_text('10 capture cycles completed; images require review.\n')
