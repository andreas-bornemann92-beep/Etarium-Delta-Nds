#include <nds.h>
#include <stdio.h>
#include <stdbool.h>
/* ETARIUM V1: deterministic Nintendo DS startup and playable map. */
#define W 256
#define H 192
#define T 16
static const char map[12][17]={
"################",
"#..............#",
"#..~~~~........#",
"#..~~~~...##...#",
"#.........##...#",
"#..............#",
"#.....####.....#",
"#..............#",
"#...~~~........#",
"#...~~~........#",
"#..............#",
"################"};
static volatile u16 * const fb=(volatile u16*)0x06800000;
static int px=2,py=2,steps=0;
static bool playing=false;
static void rect(int x,int y,int w,int h,u16 c){
 for(int j=y;j<y+h;j++)for(int i=x;i<x+w;i++)
 if(i>=0&&i<W&&j>=0&&j<H)fb[j*W+i]=c;
}
static bool can_move(int x,int y){
 return x>=0&&x<16&&y>=0&&y<12&&map[y][x]=='.';
}
static void render(void){
 if(!playing){
 rect(0,0,W,H,RGB15(3,5,12));
 rect(18,28,220,62,RGB15(22,4,7));
 rect(25,35,206,48,RGB15(28,7,10));
 return;
 }
 for(int y=0;y<12;y++)for(int x=0;x<16;x++){
 char c=map[y][x];
 u16 color=c=='#'?RGB15(12,12,14):(c=='~'?RGB15(3,12,27):RGB15(8+(x+y)%2,23,9));
 rect(x*T,y*T,T,T,color);
 }
 rect(px*T+4,py*T+3,8,11,RGB15(30,7,7));
 rect(px*T+5,py*T+4,2,2,RGB15(31,31,31));
}
static void status(void){
 consoleClear();
 iprintf("ETARIUM V1\n\n");
 if(!playing)iprintf("A oder START: Beginnen\n\nDS/Delta Starttest\n");
 else iprintf("Steuerkreuz: Bewegen\nB: Zurueck\n\nX:%d Y:%d\nSchritte:%d\n",px,py,steps);
}
int main(void){
 videoSetMode(MODE_FB0);
 vramSetBankA(VRAM_A_LCD);
 consoleDemoInit();
 render();status();
 while(pmMainLoop()){
 swiWaitForVBlank();
 scanKeys();
 u32 pressed=keysDown();
 if(!playing){
 if(pressed&(KEY_A|KEY_START)){playing=true;render();status();}
 continue;
 }
 if(pressed&KEY_B){playing=false;render();status();continue;}
 int dx=0,dy=0;
 u32 held=pressed;
 if(held&KEY_LEFT)dx=-1;
 else if(held&KEY_RIGHT)dx=1;
 else if(held&KEY_UP)dy=-1;
 else if(held&KEY_DOWN)dy=1;
 if((dx||dy)&&can_move(px+dx,py+dy)){
 px+=dx;py+=dy;steps++;render();status();
 }
 }
 return 0;
}
