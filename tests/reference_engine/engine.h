#ifndef ETARIUM_REFERENCE_ENGINE_H
#define ETARIUM_REFERENCE_ENGINE_H
#include <stdint.h>
#include <stddef.h>
#define ET_MAX_ENTITIES 32
#define ET_MAP_W 20
#define ET_MAP_H 15
#define ET_MAX_PARTY 10
#define ET_SAVE_SIZE 64
typedef enum { ET_TITLE, ET_WORLD, ET_BATTLE, ET_MENU } EtState;
typedef enum { ET_NONE, ET_UP, ET_DOWN, ET_LEFT, ET_RIGHT, ET_CONFIRM, ET_CANCEL } EtInput;
typedef struct { int16_t x,y; uint8_t active,solid,kind; } EtEntity;
typedef struct { uint16_t species,level,hp,max_hp,attack,defense,speed; uint8_t element; } EtSpirit;
typedef struct { uint8_t tiles[ET_MAP_H][ET_MAP_W]; } EtMap;
typedef struct { EtState state; EtMap map; EtEntity entities[ET_MAX_ENTITIES]; EtSpirit party[ET_MAX_PARTY]; uint8_t party_count; uint32_t tick,rng; uint8_t battle_turn; } EtGame;
void et_init(EtGame *g,uint32_t seed);
void et_step(EtGame *g,EtInput input);
int et_move(EtGame *g,unsigned entity,int dx,int dy);
uint32_t et_random(EtGame *g);
uint16_t et_damage(uint16_t power,uint16_t attack,uint16_t defense,uint16_t level,uint16_t multiplier_percent);
int et_battle_attack(EtGame *g,EtSpirit *a,EtSpirit *d,uint16_t power,uint16_t multiplier_percent);
int et_save(const EtGame *g,uint8_t out[ET_SAVE_SIZE]);
int et_load(EtGame *g,const uint8_t in[ET_SAVE_SIZE]);
#endif
