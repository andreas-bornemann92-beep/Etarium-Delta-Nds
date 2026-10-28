#include <nds.h>
/* No console, input, IPC or game engine: direct ARM9 framebuffer boot probe. */
int main(void) {
  lcdMainOnTop();
  videoSetMode(MODE_FB0);
  vramSetBankA(VRAM_A_LCD);
  volatile u16 *fb = (volatile u16 *)0x06800000;
  for (int y=0;y<192;y++) for (int x=0;x<256;x++)
    fb[y*256+x] = (u16)(BIT(15) | (x<128 ? RGB15(31,0,0) : RGB15(0,31,0)));
  while (1) swiWaitForVBlank();
}
