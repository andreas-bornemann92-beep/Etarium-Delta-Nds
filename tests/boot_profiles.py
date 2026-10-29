#!/usr/bin/env python3
"""Auditable boot-capture profiles for legacy melonDS. No proprietary BIOS files."""
from pathlib import Path
from PIL import Image, ImageChops
import argparse, hashlib, json, os, subprocess

p=argparse.ArgumentParser()
p.add_argument('--emulator',required=True)
p.add_argument('--control',required=True)
p.add_argument('--etarium',required=True)
p.add_argument('--out',required=True)
args=p.parse_args()
out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
roms={'control':Path(args.control).resolve(),'etarium':Path(args.etarium).resolve()}
profiles=[('direct_software','DirectBoot=1\nConsoleType=0\nScreenUseGL=0\nJIT_Enable=0\n'),
          ('firmware_software','DirectBoot=0\nConsoleType=0\nScreenUseGL=0\nJIT_Enable=0\n')]
results=[]
for pname,settings in profiles:
    home=out/pname/'home';home.mkdir(parents=True,exist_ok=True)
    config=home/'melonDS.ini';config.write_text(settings)
    for name,rom in roms.items():
        capture=out/pname/(name+'.png')
        capture.parent.mkdir(parents=True,exist_ok=True)
        cmd_script=r'''
cd "$1"
"$2" "$3" >/dev/null 2>&1 &
pid=$!
sleep 7
wid="$(timeout 2s xdotool search --onlyvisible --name melonDS | head -n 1 || true)"
if [ -n "$wid" ]; then timeout -k 2s 5s import -window "$wid" "$4" >/dev/null 2>&1 || true; fi
kill -TERM "$pid" 2>/dev/null || true
exit 0
'''
        cmd=['timeout','-k','3s','20s','xvfb-run','-a','-s','-screen 0 1280x900x24',
             'bash','-c',cmd_script,'_',str(home),str(Path(args.emulator).resolve()),str(rom),str(capture)]
        env={**os.environ,'HOME':str(home),'XDG_CONFIG_HOME':str(home),
             'QT_QPA_PLATFORM':'xcb','LIBGL_ALWAYS_SOFTWARE':'1','SDL_AUDIODRIVER':'dummy'}
        run=subprocess.run(cmd,env=env,timeout=25)
        record={'profile':pname,'rom':name,'capture':str(capture.relative_to(out)),
                'exit_code':run.returncode,'capture_exists':capture.exists(),
                'rom_sha256':hashlib.sha256(rom.read_bytes()).hexdigest(),
                'configuration':settings}
        if capture.exists():
            im=Image.open(capture).convert('RGB')
            record['image_sha256']=hashlib.sha256(capture.read_bytes()).hexdigest()
            record['dimensions']=im.size
            record['unique_colors']=len(im.getcolors(im.width*im.height) or [])
        results.append(record)
    control=out/pname/'control.png'
    etarium=out/pname/'etarium.png'
    if control.exists() and etarium.exists():
        a=Image.open(control).convert('RGB');b=Image.open(etarium).convert('RGB')
        same=a.size==b.size and ImageChops.difference(a,b).getbbox() is None
        results.append({'profile':pname,'control_equals_etarium':same,
                        'control_boot_verified':False,
                        'reason':'Same rendered image cannot establish ROM execution' if same else 'Image differs, manual validation required'})
(out/'boot-profiles.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
