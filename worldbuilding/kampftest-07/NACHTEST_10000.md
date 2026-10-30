# Etarium Worldbuilding – Erneute Prüfung Kampftest 07
Datum: 30.10.2026
Basis: `worldbuilding/kampftest-07/mage-turn-system.js` (unveränderte funktionierende Web-Demo).

## Vollsimulation
- 10.000 vollständige, reproduzierbare Kämpfe.
- 382.335 ausgeführte Einzelaktionen.
- 93.997 Aktionen „Äther sammeln“ und 288.338 übrige Aktionen.
- 10.000 von 10.000 Kämpfen mit abgeschlossener Sieg-/Niederlage-/Unentschieden-Auswertung.
- 165 Unentschieden und 4.212 Kämpfe mit mindestens einem K. o.
- Initiative bei Geschwindigkeitsgleichstand: Spieler-Geist 5.007-mal zuerst, Gegner-Geist 4.993-mal zuerst.
- **0 erkannte Regelverletzungen** im geprüften Ablauf.

## Geprüfte Eigenschaften
Pro Aktion: kein Doppelzug pro Runde, zulässiges Ziel, Maximal-/Minimal-LP und -Äther, korrekter Kostenabzug, korrekte Regeneration, unveränderter Kostenwert in Ereignisprotokollen. Abgelehnter freundlicher Angriff verändert den Zustand nicht.

## Gezielter Äther-Erschöpfungstest
Magieressourcen und Geisterressourcen sind unabhängig. Ein Spieler-Geist mit 0 Äther kann den Lichtfunken (12 Äther) nicht ausführen. Versuch abgewiesen und Äther unverändert; anschließend stellt „Äther sammeln“ 16 Äther wieder her. Dasselbe bei 4 Äther: Lichtfunken abgewiesen, Sammeln ergibt 20 Äther.

## Beispielwerte (Prototyp)
- Geist: 100 LP, 60 Äther, normaler Angriff 0, Lichtfunken 12, Schutz 8.
- Magier: 70 LP, 80 Äther, Angriffszauber 10, Heilung 14, Barriere 9.
- Äther sammeln: +16, maximal bis zum persönlichen Limit.
- Geschwindigkeiten: beide Geister 91, Gegner-Magier 72, Spieler-Magier 64. Bei Gleichstand wird jede Runde neu ausgelost.

**Einschränkung:** Automatisierte JavaScript-Kampfsimulation, keine neue vollständige iPhone/Safari-Oberflächen- oder Nintendo-DS-Hardwareprüfung. Die Werte bleiben ausschließlich Worldbuilding-Testwerte, nicht endgültiger Kanon. Kampftest 07 wurde nicht überschrieben.
