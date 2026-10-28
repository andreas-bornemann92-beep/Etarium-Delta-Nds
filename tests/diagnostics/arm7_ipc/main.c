#include <nds.h>
/* ARM9 -> ARM7/libnds IPC probe, separate from graphics and console. */
int main(void) {
  lcdMainOnTop();
  videoSetMode(MODE_FB0);
  vramSetBankA(VRAM_A_LCD);
  volatile u16 *fb = (volatile u16 *)0x06800000;
  for (int y=0;y<192;y++) for (int x=0;x<256;x++)
    fb[y*256+x] = (u16)(BIT(15) | RGB15(0,0,31));
  while (pmMainLoop()) {
    swiWaitForVBlank();
    scanKeys();
    if (keysDown() & KEY_A) {
      for (int i=0;i<256*192;i++) fb[i]=(u16)(BIT(15)|RGB15(31,31,0));
    }
  }
  return 0;
}
