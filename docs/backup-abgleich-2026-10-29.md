# Backup-Abgleich 2026-10-29 – Kortex / Etarium

## Eingang
Tagesbackup ETARIUM_KORTEX_TAGESBACKUP_2026-10-29(1).zip.
Enthalten: Kortex-Entwicklernetz v1.0 (Archiv v10), offene Werte v0.6,
optischer Katalog v0.1, fünf Pokémon-Vergleichswerke, eigenständiger
C11-Engine-Prototyp v0.1 und ein Lumirak-Konzeptbild.

## Gegenprobe mit Repository
- Nintendo-DS-Projekt: source/main.c + include/game_logic.h mit 16x12-Diagnosekarte.
- Backup-C11-Engine: 20x15-Testkarte; eigenständige Zustandsmaschine
  TITLE/WORLD/BATTLE/MENU, bis 32 Entitäten, 10 Party-Slots, RNG, Schaden,
  Spielstand mit Version und Prüfsumme.
- Architekturkonflikt: Kartengröße, Zustandssystem und Spielstandmodell sind
  **nicht** direkt kompatibel. Keines davon wurde ungeprüft in die DS-ROM kopiert.
- Boot-/Delta-Fehler: durch diese Offline-Engine-Tests nicht behoben.
- Referenz-CSV-Dateien: überwiegend Schemas und offene Felder; keine
  verifizierten Werte aus einer Pokémon-Platin-ROM. Keine fremden Assets oder
  Programmteile in den Build übernehmen.
- Lumirak ET-001 bleibt ein Testentwurf, nicht kanonisch.

## Implementierte, überprüfbare Integration
- tests/reference_engine/{engine.h,engine.c,test_engine.c}:
  Portabler Backup-Prototyp mit isoliertem Build; unveränderte Etarium-DS-
  Spiellogik und ROM-Grafikinitialisierung.
- CI-Job 'backup-reference-engine': zehn sequenzielle Host-Regressionsläufe.
- Der Backup-Test wurde lokal mit gcc -std=c11 -Wall -Wextra -Werror
  -fsanitize=undefined ausgeführt: PASS.
- Der CI-Lauf und die DS-Emulator-Kompatibilität müssen separat bewertet werden.

## Freigaberegeln
1. Änderungen an kanonischen Figuren, Elementen und Klassen nur mit Freigabe.
2. Vor Übernahme der 20x15-Engine in die DS-Version: Datenmapping,
   VRAM-/RAM-Budget, Spielstandmigration, Eingabe- und Darstellungstests.
3. Grüne Workflow-Jobs allein belegen keinen erfolgreichen Delta-Start.
4. Keine automatische Synchronisierung zu anderen Chats/Agenten behaupten.
