#include <nds.h>
#include <stdio.h>

/* Etarium DS smoke test. Game content is not yet implemented. */
typedef enum {
    SCREEN_TITLE = 0,
    SCREEN_ADVENTURE = 1
} GameScreen;

static void render_screen(GameScreen screen)
{
    consoleClear();
    iprintf("ETARIUM\n");
    iprintf("------------------------\n\n");

    switch (screen) {
    case SCREEN_TITLE:
        iprintf("Nintendo DS prototype\n\n");
        iprintf("A: Begin adventure\n");
        break;
    case SCREEN_ADVENTURE:
        iprintf("Adventure begins!\n\n");
        iprintf("Press START to return.\n");
        break;
    default:
        iprintf("Unknown screen\n");
        break;
    }
}

int main(void)
{
    GameScreen screen = SCREEN_TITLE;
    consoleDemoInit();
    render_screen(screen);

    for (;;) {
        swiWaitForVBlank();
        scanKeys();
        const u32 pressed = keysDown();

        if ((pressed & KEY_START) != 0) {
            if (screen != SCREEN_TITLE) {
                screen = SCREEN_TITLE;
                render_screen(screen);
            }
        } else if (screen == SCREEN_TITLE && (pressed & KEY_A) != 0) {
            screen = SCREEN_ADVENTURE;
            render_screen(screen);
        }
    }
}
