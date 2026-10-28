#include <assert.h>
#include <stdio.h>
#include "game_logic.h"

int main(void) {
 int tests=0;
 for (int y=-2;y<ETARIUM_MAP_H+2;y++) {
  for (int x=-2;x<ETARIUM_MAP_W+2;x++) {
   int valid=(x>=0 && x<ETARIUM_MAP_W && y>=0 && y<ETARIUM_MAP_H);
   int expected=valid && etarium_map[y][x]=='.';
   assert(etarium_can_move(x,y)==expected);
   tests++;
  }
 }
 int x=2,y=2,steps=0;
 assert(etarium_can_move(x,y));
 for(int i=0;i<10000;i++) {
  int dx=(i%4==0)-(i%4==1);
  int dy=(i%4==2)-(i%4==3);
  etarium_move(&x,&y,dx,dy,&steps);
  assert(etarium_can_move(x,y));
  assert(steps>=0 && steps<=i+1);
  tests+=2;
 }
 int px=x,py=y,old=steps;
 etarium_move(&x,&y,1,1,&steps);
 assert(x==px && y==py && steps==old);
 etarium_move(&x,&y,5,0,&steps);
 assert(x==px && y==py && steps==old);
 assert(!etarium_can_move(-1,0));
 assert(!etarium_can_move(16,0));
 assert(!etarium_can_move(0,12));
 printf("ETARIUM NATIVE LOGIC PASS: %d checks\n",tests+5);
 return 0;
}
