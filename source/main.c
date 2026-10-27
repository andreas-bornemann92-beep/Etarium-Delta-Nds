#include <nds.h>
#include <stdio.h>

/* Dual-screen startup diagnostic: independent upper framebuffer + console. */
int main(void)
{
    videoSetMode(MODE_FB0);
    vramSetBankA(VRAM_A_LCD);

    volatile u16 *top = (volatile u16 *)0x06800000;
    for (int y = 0; y < 192; ++y) {
        for (int x = 0; x < 256; ++x) {
            top[y * 256 + x] = (x < 128) ? RGB15(20, 0, 0) : RGB15(0, 0, 20);
        }
    }

    consoleDemoInit();
    iprintf("ETARIUM - STARTTEST\n\n");
    iprintf("ARM9 aktiv\n");
    iprintf("Oben ROT / BLAU\n");
    iprintf("Taste A testen\n");

    unsigned int frames = 0;
    while (pmMainLoop()) {
        swiWaitForVBlank();
        scanKeys();
        if (keysDown() & KEY_A) {
            iprintf("A erkannt (%lu)\n", (unsigned long)frames);
        }
        ++frames;
    }
    return 0;
}
