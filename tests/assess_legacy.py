#!/usr/bin/env python3
"""Fail closed on known all-white legacy melonDS screenshots.
A screenshot is NOT proof of successful emulation; this is only a diagnostic gate.
"""
import json
import sys
from pathlib import Path
from PIL import Image, ImageChops

directory=Path(sys.argv[1])
results=json.loads((directory/'results.json').read_text())
assert len(results)==20, f"expected 20 captures, got {len(results)}"
assert [r['iteration'] for r in results]==[i for i in range(1,11) for _ in range(2)]
assert all(r['file_exists'] and r['process_exit']==0 for r in results)
files=[directory/r['capture'] for r in results]
images=[Image.open(p).convert('RGB') for p in files]
same=all(ImageChops.difference(images[0],i).getbbox() is None for i in images[1:])
control_matches_subject=all(
 ImageChops.difference(images[i],images[i+1]).getbbox() is None
 for i in range(0,len(images),2))
# Detect the exact previously observed failure: all 20 frames are identical.
report={'captures':len(files),'identical_all_frames':same,
        'control_matches_etarium_all_cycles':control_matches_subject,
        'boot_verified':False,
        'status':'FAIL' if same else 'INCONCLUSIVE',
        'reason':'Identical screenshots for all control and Etarium runs: emulator boot unverified' if same else
        'Distinct frames captured, but visual display and input still require verification'}
(directory/'assessment.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if same:
    sys.exit(1)
