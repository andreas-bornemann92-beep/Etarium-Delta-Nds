#!/usr/bin/env python3
"""Five isolated Nintendo DS video-boot hypotheses, retaining Etarium as baseline."""
from pathlib import Path
import json
import sys
original=Path(sys.argv[1]).read_text()
dest=Path(sys.argv[2]);dest.mkdir(parents=True,exist_ok=True)
start=original.index("static void init_video(void) {")
end=original.index("\nint main(void){",start)
variants=[
 ("01_bg3_console", "Existing bitmap BG3 + sub console", """ lcdMainOnTop();
 videoSetMode(MODE_5_2D); vramSetBankA(VRAM_A_MAIN_BG);
 int background=bgInit(3,BgType_Bmp16,BgSize_B16_256x256,0,0);
 fb=(volatile u16*)bgGetGfxPtr(background);
 videoSetModeSub(MODE_0_2D); vramSetBankC(VRAM_C_SUB_BG);
 consoleInit(NULL,3,BgType_Text4bpp,BgSize_T_256x256,31,0,false,true);""",False),
 ("02_bg3_no_console", "Bitmap BG3, sub engine and console skipped", """ lcdMainOnTop();
 videoSetMode(MODE_5_2D); vramSetBankA(VRAM_A_MAIN_BG);
 int background=bgInit(3,BgType_Bmp16,BgSize_B16_256x256,0,0);
 fb=(volatile u16*)bgGetGfxPtr(background);""",True),
 ("03_lcd_framebuffer", "Direct LCD VRAM A framebuffer, no console", """ lcdMainOnTop();
 videoSetMode(MODE_FB0); vramSetBankA(VRAM_A_LCD);
 fb=(volatile u16*)0x06800000;""",True),
 ("04_bg2_console", "Bitmap BG2 instead of BG3, with sub console", """ lcdMainOnTop();
 videoSetMode(MODE_5_2D); vramSetBankA(VRAM_A_MAIN_BG);
 int background=bgInit(2,BgType_Bmp16,BgSize_B16_256x256,0,0);
 fb=(volatile u16*)bgGetGfxPtr(background);
 videoSetModeSub(MODE_0_2D); vramSetBankC(VRAM_C_SUB_BG);
 consoleInit(NULL,3,BgType_Text4bpp,BgSize_T_256x256,31,0,false,true);""",False),
 ("05_bg3_bottom", "Bitmap BG3 on bottom LCD (routing hypothesis)", """ lcdMainOnBottom();
 videoSetMode(MODE_5_2D); vramSetBankA(VRAM_A_MAIN_BG);
 int background=bgInit(3,BgType_Bmp16,BgSize_B16_256x256,0,0);
 fb=(volatile u16*)bgGetGfxPtr(background);
 videoSetModeSub(MODE_0_2D); vramSetBankC(VRAM_C_SUB_BG);
 consoleInit(NULL,3,BgType_Text4bpp,BgSize_T_256x256,31,0,false,true);""",False)
]
manifest=[]
for name,desc,init,no_console in variants:
    s=original[:start]+"static void init_video(void) {\n"+init+"\n}\n"+original[end:]
    if no_console:
        s=s.replace(" consoleClear();"," /* console deliberately disabled for diagnosis */")
        s=s.replace(' iprintf(', ' /* no screen text */ // iprintf(')
        # status function replaced entirely to avoid misleading console access
        a=s.index("static void status(void){");b=s.index("static void init_video(void)",a)
        s=s[:a]+"static void status(void){ /* intentionally disabled */ }\n"+s[b:]
    # Ensure rendered start screen is unique per hypothesis by adding color marker
    s=s.replace("rect(25,35,206,48,RGB15(28,7,10));","rect(25,35,206,48,RGB15(28,7,10));\n rect(0,0,12,12,RGB15("+str(len(manifest)*6)+",31,0));")
    p=dest/name;p.mkdir(parents=True,exist_ok=True);(p/"main.c").write_text(s)
    manifest.append({"name":name,"hypothesis":desc,"console_disabled":no_console})
(dest/"manifest.json").write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
