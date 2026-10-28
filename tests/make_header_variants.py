#!/usr/bin/env python3
"""Create isolated Etarium DS header diagnostic ROMs, preserving the baseline."""
from pathlib import Path
import json, struct, sys, hashlib

def crc16(data):
    crc=0xffff
    for b in data:
        crc ^= b
        for _ in range(8):
            crc=(crc>>1)^ (0xa001 if crc & 1 else 0)
    return crc

src=Path(sys.argv[1]).read_bytes()
out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
if len(src)<0x200: raise ValueError('ROM shorter than DS header')
original=src[0x12]
variants={'baseline':src}
if original!=0:
    patched=bytearray(src)
    patched[0x12]=0 # DS, not DSi
    struct.pack_into('<H',patched,0x15e,crc16(patched[:0x15e]))
    variants['ds_unit_0']=bytes(patched)
else:
    print('Baseline already has DS unit 0; no duplicate header variant.')
results=[]
for name,data in variants.items():
    target=out/(name+'.nds');target.write_bytes(data)
    results.append({'variant':name,'unit_code':data[0x12],
                    'header_crc_stored':hex(struct.unpack_from('<H',data,0x15e)[0]),
                    'header_crc_computed':hex(crc16(data[:0x15e])),
                    'sha256':hashlib.sha256(data).hexdigest(),
                    'bytes':len(data)})
(out/'manifest.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
