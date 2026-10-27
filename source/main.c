#include <nds.h>
#include <stdio.h>

int main(void) {
    consoleDemoInit();
    iprintf("ETARIUM\n");
    iprintf("Nintendo DS prototype\n\n");
    iprintf("A: start adventure\n");
    while (1) {
        swiWaitForVBlank();
        scanKeys();
        if (keysDown() & KEY_A) {
            consoleClear();
            iprintf("ETARIUM\n\nAdventure begins!\n");
        }
    }
    return 0;
}
