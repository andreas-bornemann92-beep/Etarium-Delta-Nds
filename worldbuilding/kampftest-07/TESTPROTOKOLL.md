# Etarium Worldbuilding – Kampftest 07: Äther-Leisten

**Status:** Experimenteller Prototyp, nicht als endgültiger Kanon freigegeben.
**Basis:** Kampftest 06 mit Geschwindigkeitsinitiative, zufälliger Reihenfolge bei Gleichstand, vier individuellen Teilnehmern und ausgewählten Zielen.

## Ressourcen
- Geister: **60/60 Äther**, Magier: **80/80 Äther**.
- Normaler Geist-Angriff: 0 Äther.
- Geist-Magie: 12 Äther, Schutz: 8 Äther.
- Magier-Angriffszauber: 10 Äther, Heilung: 14 Äther, magische Barriere: 9 Äther.
- **Äther sammeln:** keine Kosten, stellt bis zu 16 Äther wieder her; zählt als reguläre Aktion.
- Jede Figur besitzt einen eigenen Vorrat, sichtbare blaue Leiste und Zahlenanzeige.
- Sind die Kosten nicht gedeckt, ist die Aktion nicht ausführbar; das System lässt keinen negativen Ätherstand zu.
- Gegner-KI berücksichtigt nur bezahlbare Aktionen; kostenlose Sammelaktion steht bei Bedarf bereit.
- Heilung ist auf das jeweilige LP-Maximum, Ätherregeneration auf das jeweilige Äther-Maximum begrenzt.

## Verifikation
- **1.000 vollständige Kämpfe**
- **38.458 Einzelaktionen**, davon **8.031 Sammelaktionen**
- **30.427 Prüfungen des Kostenabzugs**, **8.031 Regenerationsprüfungen**
- **153.832 Ressourcengrenzprüfungen**
- **0 erkannte Fehler** bei Kostenabzug, Regeneration, maximalen/minimalen Ätherwerten oder Kampffortschritt
- Startspieler: Spieler-Geist 504, Kaels Geist 496
- Ausgänge bei dieser Teststrategie: 544 Spielerteam, 439 Gegnerteam, 17 unentschieden

Die Ergebnisse beruhen auf einer JavaScript-Simulation mit zufällig gewählten legalen Spieleraktionen und einfacher Gegner-KI, nicht auf einem vollständigen iPhone-Hardwaretest. Die automatische 10-Runden-Grenze bleibt eine vorläufige Testregel.

Die Datei `worldbuilding/kampftest-06/` bleibt unverändert. Die neue Version befindet sich in `worldbuilding/kampftest-07/`. Die Werte sind experimentell und werden erst nach ausdrücklicher Zustimmung Teil des Etarium-Kanons.
