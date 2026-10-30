# ETARIUM Worldbuilding – Dreifachkampf 03 – Aktiv-/Passiv-Modus

**Grundlage:** Vom Nutzer freigegebene Referenzdemo `worldbuilding/dreifachkampf-02/`. Diese bleibt unverändert. Die neue Versuchsversion ist `worldbuilding/dreifachkampf-03/`.

## Bereits festgelegte Grundregeln, implementiert
- **Aktiv:** Magier ist angreifbar und hat Offensivzauber, magische Kontrolle, Schutz, Heilung und Ätherregeneration.
- **Passiv:** Magier ist nicht angreifbar und besitzt Unterstützungs-/Befehlsaktionen für die eigenen Geister, Schutz, Heilung und Ätherregeneration.
- **Wechsel:** Nur auf eigenem Zug; Wechsel zwischen Aktiv und Passiv kostet die **gesamte Hauptaktion**, maximal **einmal pro Runde**; der Gegner kann nicht für den Magier wechseln.
- **Sieg/Niederlage:** Der eigene Magier ist K. o. oder alle drei eigenen Geister sind K. o. Keine starre Rundengrenze. Ein passiver Magier kann nicht direkt angegriffen werden; alle eigenen Geister K. o. beendet den Kampf trotz passivem Magier.

## Testfähigkeiten (Werte experimentell)
- Aktiv: Funkenstoß/Arkanstoß 14 LP für 10 Äther; Fesselzauber für 12 Äther, senkt nächsten Angriff des Ziels um 6; Heillicht +16 LP für 14 Äther; Schutzkreis 12 Schutz für 9 Äther; Äther sammeln +16.
- Passiv: Angriffsbefehl gibt einem lebenden eigenen Geist +6 Schaden beim nächsten Angriff (8 Äther); Heillicht +16 LP für 14 Äther an verletzten eigenen Geist; Schutzbefehl gibt 12 Schutz (9 Äther) an einen eigenen Geist; Äther sammeln +16.
- Unterstützungsboni werden beim nächsten Angriff verbraucht und können nicht gestapelt werden.
- **Verbindliche Fangregel (Nutzerkorrektur):** Im **Passiv-Modus** darf ein Magier **wilde Geister fangen**. Diese Erlaubnis gilt ausdrücklich auch dann, wenn der Magier selbst nicht angreifbar ist. Sie gilt nicht pauschal für die Geister eines gegnerischen Magiers. **Technisch noch offen:** Wildkampf-Erkennung, Fangauslösung, Fangwahrscheinlichkeit, Hilfsmittel, Fanggrenzen und Folgen bei Erfolg/Misserfolg; diese Effekte sind in Dreifachkampf 03 noch nicht implementiert. Keine Fangquoten erfinden.
- Die oben genannten Zahlen sind lediglich Worldbuilding-Testwerte und **keine neuen Kanonwerte**.

## Testläufe
- **3.000 vollständig simulierte Kämpfe**, **125.057 Aktionen**.
- **11.838 Moduswechsel**, davon Aktiv → Passiv und Passiv → Aktiv im normalen Kampffluss.
- **0 festgestellte Regelverletzungen** bei Zielwahl, Wechselstempeln, LP-/Äthergrenzen, Ergebnis-/Niederlagegrund und Kampffortschritt.
- Ergebnisse: 1.243 endeten durch Magier-K. o., 1.757 durch K. o. aller drei Geister.
- Separater isolierter UI-Test: Schaltfläche `Passiv werden` führte einen Zug aus; Status wechselte sichtbar zu `DEIN MAGIER · PASSIV · GESCHÜTZT`.
- Keine reale Safari-Hardwareprüfung; Nutzer soll Touch-Verhalten der neuen Seite prüfen.

## Versionsregeln
Dreifachkampf 02 bleibt der **freigegebene Referenzstand**. Dreifachkampf 03 ist ein **neuer Modul-Test**; erst nach Bestätigung des Nutzers als neue freigegebene Variante markieren.
