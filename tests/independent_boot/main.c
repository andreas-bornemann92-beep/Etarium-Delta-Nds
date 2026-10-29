#include <nds.h>
#include <stdio.h>
#include <stdbool.h>

/*
 * ETARIUM DELTA BOOT B – independent, original DS homebrew startup.
 * Uses documented DS main/sub 2D engines and standard libnds/calico ARM7.
 * Not derived from Pokémon Platinum source or proprietary boot data.
 */
#define SCREEN_W 256
#define SCREEN_H 192

static volatile u16 *main_pixels;
static int cx=128, cy=96;
static unsigned frames=0;
static bool started=false;

static void draw_box(int x0,int y0,int w,int h,u16 color) {
    for (int y=y0;y<y0+h;y++) {
        if (y<0 || y>=SCREEN_H) continue;
        for (int x=x0;x<x0+w;x++) {
            if (x<0 || x>=SCREEN_W) continue;
            main_pixels[y*SCREEN_W+x] = (u16)(color | BIT(15));
        }
    }
}

static void init_displays(void) {
    lcdMainOnTop();
    videoSetMode(MODE_5_2D);
    vramSetBankA(VRAM_A_MAIN_BG);
    int main_bg=bgInit(3,BgType_Bmp16,BgSize_B16_256x256,0,0);
    main_pixels=(volatile u16 *)bgGetGfxPtr(main_bg);

    videoSetModeSub(MODE_0_2D);
    vramSetBankC(VRAM_C_SUB_BG);
    consoleInit(NULL,3,BgType_Text4bpp,BgSize_T_256x256,31,0,false,true);
}

static void paint(void) {
    draw_box(0,0,256,192,RGB15(3,9,19));
    draw_box(16,24,224,48,RGB15(24,4,7));
    draw_box(24,32,208,32,RGB15(31,8,8));
    draw_box(16,168,224,8,RGB15(4,28,13));
    if (started) {
        draw_box(cx-5,cy-7,10,14,RGB15(31,30,5));
    } else {
        draw_box(120,107,16,16,RGB15(28,25,5));
    }
}

static void update_text(void) {
    consoleClear();
    iprintf("ETARIUM DELTA BOOT B\n\n");
    iprintf("Independent DS boot test\n");
    iprintf("A / START: Activate\n");
    iprintf("D-PAD: Move | B: Reset\n\n");
    iprintf("Running: %s\n",started ? "YES":"NO");
    iprintf("X:%d Y:%d\n",cx,cy);
    iprintf("Frames:%u\n",frames);
}

int main(void) {
    init_displays();
    paint();
    update_text();
    while (pmMainLoop()) {
        swiWaitForVBlank();
        frames++;
        scanKeys();
        u32 down=keysDown();
        if (down&(KEY_A|KEY_START)) started=true;
        if (down&KEY_B) { started=false; cx=128;cy=96; }
        if (started) {
            u32 held=keysHeld();
            if ((frames%5)==0) {
                if (held&KEY_LEFT && cx>6) cx--;
                if (held&KEY_RIGHT && cx<249) cx++;
                if (held&KEY_UP && cy>7) cy--;
                if (held&KEY_DOWN && cy<184) cy++;
            }
        }
        if (down || frames%60==0) {
            paint();
            update_text();
        }
    }
    return 0;
}
