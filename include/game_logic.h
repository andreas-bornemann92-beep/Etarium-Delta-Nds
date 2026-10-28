#ifndef ETARIUM_GAME_LOGIC_H
#define ETARIUM_GAME_LOGIC_H

/* Platform-independent gameplay rules; shared by the DS target and native tests. */
#define ETARIUM_MAP_W 16
#define ETARIUM_MAP_H 12
static const char etarium_map[ETARIUM_MAP_H][ETARIUM_MAP_W+1] = {
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
"################"
};
static inline int etarium_can_move(int x, int y) {
 return x >= 0 && x < ETARIUM_MAP_W &&
        y >= 0 && y < ETARIUM_MAP_H &&
        etarium_map[y][x] == '.';
}
static inline void etarium_move(int *x, int *y, int dx, int dy, int *steps) {
 if ((dx == 0) == (dy == 0)) return; /* exactly one cardinal direction */
 if (dx < -1 || dx > 1 || dy < -1 || dy > 1) return;
 if (etarium_can_move(*x + dx, *y + dy)) {
  *x += dx; *y += dy; ++*steps;
 }
}
#endif
