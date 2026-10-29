#!/usr/bin/env python3
"""Structural ROM checks and A/B comparison; independent of emulator GUI."""
from pathlib import Path
import sys, json, struct, hashlib

def crc16(data):
    crc=0xffff
    for b in data:
        crc ^= b
        for _ in range(8):
            crc=(crc>>1)^(0xa001 if crc&1 else 0)
    return crc

data={}
for name,file in [('A',Path(sys.argv[1])),('B',Path(sys.argv[2]))]:
    buf=file.read_bytes()
    assert len(buf)>=0x200, f'{name}: short ROM'
    fields={}
    for cpu,off in [('arm9',0x20),('arm7',0x30)]:
        rom,entry,ram,size=struct.unpack_from('<IIII',buf,off)
        assert size>0 and rom>=0x200 and rom+size<=len(buf),f'{name}: invalid {cpu} data'
        assert ram<=entry<ram+size,f'{name}: {cpu} entry outside payload'
        fields[cpu]={'rom_offset':rom,'entry':entry,'ram':ram,'size':size}
    stored=struct.unpack_from('<H',buf,0x15e)[0]
    assert stored==crc16(buf[:0x15e]),f'{name}: invalid header CRC'
    data[name]={'bytes':len(buf),'unit_code':buf[0x12],'game_code':buf[0x0c:0x10].decode('ascii','replace'),
                'sha256':hashlib.sha256(buf).hexdigest(),'header_crc':stored,'cpus':fields}
assert data['A']['sha256']!=data['B']['sha256'],'A and B must differ'
Path(sys.argv[3]).write_text(json.dumps(data,indent=2))
print(json.dumps(data,indent=2))
