#include <nds.h>
#include <stdio.h>

/* Etarium DS boot diagnostic: visible backgrounds on both LCDs. */
typedef enum {
    SCREEN_TITLE = 0,
    SCREEN_ADVENTURE = 1
} GameScreen;

static void render_screen(GameScreen screen)
{
    consoleClear();
    iprintf("ETARIUM - BOOT TEST\n");
    iprintf("------------------------\n\n");
    if (screen == SCREEN_TITLE) {
        iprintf("A: Begin adventure\n");
        iprintf("START: Return to title\n");
    } else {
        iprintf("Adventure begins!\n");
        iprintf("START: Return to title\n");
    }
}

int main(void)
{
    /* Explicitly initialize both displays before setting up the console. */
    powerOn(POWER_ALL_2D);
    videoSetMode(MODE_0_2D);
    videoSetModeSub(MODE_0_2D);
    vramSetBankA(VRAM_A_MAIN_BG);
    vramSetBankC(VRAM_C_SUB_BG);

    /* Main screen: blue. Sub screen: green, even if text fails. */
    BG_PALETTE[0] = RGB15(0, 0, 24);
    BG_PALETTE_SUB[0] = RGB15(0, 24, 0);

    consoleInit(NULL, 0, BgType_Text4bpp, BgSize_T_256x256, 0, 0, true, true);
    GameScreen screen = SCREEN_TITLE;
    render_screen(screen);

    for (;;) {
        swiWaitForVBlank();
        scanKeys();
        const u32 pressed = keysDown();
        if ((pressed & KEY_START) && screen != SCREEN_TITLE) {
            screen = SCREEN_TITLE;
            render_screen(screen);
        } else if ((pressed & KEY_A) && screen == SCREEN_TITLE) {
            screen = SCREEN_ADVENTURE;
            render_screen(screen);
        }
    }
}
