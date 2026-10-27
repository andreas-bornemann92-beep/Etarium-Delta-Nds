#include <nds.h>
#include <stdio.h>

typedef enum {
    SCREEN_TITLE,
    SCREEN_ADVENTURE
} GameScreen;

static void draw_title(void) {
    consoleClear();
    iprintf("ETARIUM\n");
    iprintf("Nintendo DS prototype\n\n");
    iprintf("A: Begin adventure\n");
    iprintf("START: Return to title\n");
}

static void draw_adventure(void) {
    consoleClear();
    iprintf("ETARIUM\n\n");
    iprintf("Adventure begins!\n\n");
    iprintf("START: Return to title\n");
}

int main(void) {
    GameScreen screen = SCREEN_TITLE;
    consoleDemoInit();
    draw_title();

    while (1) {
        swiWaitForVBlank();
        scanKeys();
        const u32 pressed = keysDown();

        if (pressed & KEY_START) {
            screen = SCREEN_TITLE;
            draw_title();
        } else if (screen == SCREEN_TITLE && (pressed & KEY_A)) {
            screen = SCREEN_ADVENTURE;
            draw_adventure();
        }
    }
}
