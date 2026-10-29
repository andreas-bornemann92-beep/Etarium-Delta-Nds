#include <nds.h>
/*
 * ETARIUM B: isolated DS ARM9 video boot probe.
 * Different from A: no sub-console, IPC keyboard scan, map, or pmMainLoop.
 * Official devkitPro/libnds bootstrap and DS video engine; no proprietary code.
 * Intended screen: top half bright magenta, bottom half cyan.
 */
int main(void) {
    lcdMainOnTop();
    videoSetMode(MODE_5_2D);
    vramSetBankA(VRAM_A_MAIN_BG);
    int bg = bgInit(3, BgType_Bmp16, BgSize_B16_256x256, 0, 0);
    volatile u16 *pixels = (volatile u16 *)bgGetGfxPtr(bg);
    for (int y=0; y<192; ++y) {
        u16 c = (u16)(BIT(15) | (y<96 ? RGB15(31,0,31) : RGB15(0,31,31)));
        for (int x=0; x<256; ++x) pixels[y*256+x]=c;
    }
    for (;;) swiWaitForVBlank();
}
