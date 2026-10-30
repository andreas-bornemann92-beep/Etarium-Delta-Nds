# ETARIUM WORLDBUILDING – KAMPFSYSTEM TESTPROTOKOLL 06
Stand: 30.10.2026

## Umfang und Testmethode
Basis: die vom Nutzer auf dem iPhone als funktionierend bestätigte Browserdemo `worldbuilding/kampftest-06/`.
Engine: `mage-turn-system.js`. Ausgeführt: **5.000 komplette, reproduzierbar mit Pseudozufall gespeiste Kämpfe** mit gemischten legalen Spieleraktionen und der vorhandenen Gegner-KI. Pro Zug geprüft: Initiative, nur einmalige Aktion jeder lebenden Figur je Runde, gültige Ziele, Fortschritt, Kampfausgang und LP-Grenzen. Zusätzlich 7 gezielte Einzelfälle (Gleichstand bei Startauslosung, ungültige Ziele, Direktschaden auf Magier, Heilziel/Heilobergrenze und Geist-Schutz).

## Eingestellte Beispielwerte (noch keine Kanonfreigabe)
| Kämpfer | LP | Geschwindigkeit |
|---|---:|---:|
| Dein Geist | 100 | 91 |
| Kaels Geist | 100 | 91 |
| Dein Magier | 70 | 64 |
| Magier Kael | 70 | 72 |

Geist: Angriff 16, Magie 22, Schutz absorbiert 12 beim nächsten Treffer. Magier: Schadenszauber 14, Heilung bis zu 16 LP, Barriere absorbiert 12 beim nächsten Treffer. Lebenspunkte werden bei 0 und beim jeweiligen Maximum begrenzt. Kein Ätherverbrauch implementiert.

**Zugfolge:** höchste Geschwindigkeit zuerst; bei Geschwindigkeitgleichstand wird innerhalb dieser Gruppe **jede Runde neu ausgelost**. Beide Geister haben Tempo 91; danach Magier Kael (72) und Spieler-Magier (64). K. o.-Figuren setzen aus.

## Ergebnisse der 5.000 Kampfsimulationen
- **Regel-/Grenzwertverletzungen: 0**
- Spielerteam siegt: **2.310 (46,20 %)**
- Kaels Team siegt: **2.592 (51,84 %)**
- Unentschieden: **98 (1,96 %)**
- Startspieler: Spieler 2.504, Gegner 2.496 (50,08 % zu 49,92 %)
- Mittelwert: **9,9776 Runden**, **37,9294 Aktionen** pro Kampf
- Ausgeführte Aktionen: Schaden 105.737, Heilung 33.597, Schutz 50.313
- Gesamtschaden: Spielerteam 769.836, Gegnerteam 662.490. Schaden ist eine akkumulierte Testmetrik, keine Effektivitätsmetrik pro Kämpfer.
- K. o. bei Kampfende: Spieler-Magier 1.545, Gegner-Magier 1.119, Spieler-Geist 287, Gegner-Geist 194
- Die meisten Kämpfe enden wegen der **Prototyp-Rundengrenze nach zehn Runden**, nicht wegen des K. o. einer vollständigen Gruppe.

**Interpretation:** Der Simulator zeigt einen leichten Vorsprung für Kaels Team unter dieser konkreten Teststrategie. Die Spieleraktionen wurden für den Belastungstest zufällig aus legalen Optionen gewählt, während Kael eine einfache gewichtete KI verwendet. Daher lässt sich daraus keine allgemeine Aussage über die Spielbalance bei menschlicher Spielweise ableiten.

## Zusätzliche Einzelfallprüfungen
Sieben von sieben erfolgreich: Beide Reihenfolgen bei exakt gleicher Geschwindigkeit, ungültiges freundliches Angriffsziel abgewiesen ohne Statusänderung, Magier nimmt 16 LP Schaden, verletzter Magier wird heilbares Ziel, Geist kann nur sich selbst schützen, Heilung überschreitet 70 LP nicht.

## Abgleich mit dem geplanten Kampfsystem
**Prototyp erfolgreich:** Eigene LP für Magier und Geist, individuelle Initiative, frei auswählbare berechtigte Ziele, abwechselnd einzeln ausgeführte Züge, Schadens-, Heil- und Schutzaktionen, einfache Gegner-KI, K. o.-Überspringen und Teamauswertung.

**Noch nicht kanonisch umgesetzt:** Magier-Modus aktiv/passiv samt Wechselkosten, individuelles Ressourcenmodell mit Äther/Seelenfeuer, Seelenresonanz, acht Attribute, 12 Elemente und Matchups, klassengebundene Zauber sowie Einzel-/Doppel-/Dreifachkämpfe. Die automatische Abrechnung nach zehn Runden ist eine Testbegrenzung, **keine finale Kampfregel**. Ein Sieg der gesamten Gruppe bei Ausfall des Magiers ist noch nicht anhand finaler Aktiv/Passiv-Regeln abgestimmt.

## Nächste logische Optimierungen
1. Initiative und Zustandswechsel in die geplanten Magier-/Geister-Modi integrieren.
2. Zielregeln und Niederlagebedingungen für aktive und passive Magier festlegen.
3. Zauberkosten, Wirkung, Elementaffinitäten und Schadensformeln gesondert testen.
4. KI gegen gleichwertige Strategien vergleichen, statt rein zufällig gewählte Spieleraktionen.
5. Zehn-Runden-Limit nur als Testschalter führen.

**Testgrenze:** Engine-Tests in JavaScript, keine neue Hardware-/Safari-Automation und keine Nintendo-DS-ROM-Prüfung. Der Nutzer hat die vorherige Demo 06 im Browser als funktionierend bestätigt.
