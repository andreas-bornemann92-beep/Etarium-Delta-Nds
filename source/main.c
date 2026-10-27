#include <nds.h>
#include <stdio.h>

/* Minimal boot test using the supported libnds console setup. */
int main(void)
{
    consoleDemoInit();
    iprintf("ETARIUM\n\n");
    iprintf("DS boot test\n");
    iprintf("Press A to confirm input\n");

    for (;;) {
        swiWaitForVBlank();
        scanKeys();
        if (keysDown() & KEY_A) {
            iprintf("A button works!\n");
        }
    }
}
