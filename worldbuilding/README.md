# ETARIUM – WORLDBUILDING
Stand: 30. Oktober 2026
Status: **Konzeptwelt / Entwicklungs- und Testumgebung**
Letzter technisch geprüfter Programmstand: **Etarium X** (GitHub Pages: `gh-pages`, Snapshot-Basispunkt `07adfba5f0e2bcf27d3d73c45b8fe272b675e496`).

## Zweck
Worldbuilding ist der eigene, allgemein verwendbare Entwicklungsschritt für **Erproben neuer Elemente**: visuelle Konzepte, Weltgestaltung, spielerische Funktionen, UI und Interaktionen. Ein bestandener Prototypentest ist keine Freigabe als endgültiger Etarium-Kanon und keine Nintendo-DS-ROM. Veränderungen zuerst hier erproben; erst nach ausdrücklicher Bestätigung in den verbindlichen Spielekanon übernehmen.

## Derzeitiger Konzeptstand
- **Welt**: Eichenbrunn als farbenfrohe, freundliche Fantasy-Stadt, handgezeichnete HD-2D-Pixeloptik als Ziel; lebendiger Markt, Brunnen, Fachwerk, Gassen, Laternen, Blumen, Bänke, Bäume, größere Gebäude und Türen.
- **Titel/Start**: geplanter separater Startbildschirm mit ETARIUM-Titel, `START drücken`, danach `Neues Spiel`, `Spiel laden`, `Einstellungen`. Die zuletzt erzeugten Titel-/Menü-Konzeptbilder sind **Bildentwürfe**, noch keine gesichert implementierte Programmfunktion.
- **Editor**: einfache individuelle Auswahl, spätere tatsächliche Übereinstimmung von Editorvorschau und Ingame-Figur. Spielfigur, Beine, Proportionen und Animationen benötigen visuelle Überarbeitung. Aktuelle Editor-Prototypvarianten sind Testfälle und kein finaler Figurenstandard.
- **NPCs**: Mara (Begrüßung), Toren (Patrouille), Elis (Brunnen), Kael (Trainingskampf). Leicht unterschiedliche Größen, individuell gestaltete Kleidung und Animationen.
- **Dialogmatrix**: 100 originale Textknoten, je 25 pro NPC, verzweigt mit optionalen Antworten; alle 100 im Testskript erreichbar. Gewünscht ist zusätzlich eine **kleine Dialogbox direkt im Spielfeld**, Auswahl steuerbar mit dem Steuerkreuz/virtuellen Joystick, A bestätigen, B zurück.
- **Gebäude**: vier prototypisch betretbare Räume mit je einem Bewohner/Händler; größere Häuser und Eingänge als nächster Art-Pass.
- **Kampf**: einfache Simulation mit Angriff/Magie/Schutz und Gegnerkonter; nach 2 Runden automatisch Sieg und Rückkehr; Gameplay-Balance noch kein Kanon.
- **Steuerung**: statt alter großer Tastenleiste ein Joystick/Steuerkreuz; A und B sowie START und SELECT bleiben. Das ist eine **angeforderte Umgestaltung**, nicht bereits verifiziert implementiert.
- **Bedienung**: iPhone/Safari als Prototypziel. Die GitHub-Pages-Adresse wurde auf Anwender-Screenshots mit laufender Version X gezeigt. Ein `.nds`-Build der letzten Version wurde nicht nachgewiesen.

## Begutachtete Screenshots und Entwürfe
Nutzer-Screenshots 30.10.2026 zeigen tatsächliche Eichenbrunn-Spieloberfläche mit Figur, NPCs, Brunnen, Karten und Touch-Bedienelementen. Dabei festgestellte offene Punkte: uneinheitliche Figurenproportionen, nicht vollständig passende Editorvarianten, verdrehte Beine, verbesserungsbedürftige Detailqualität, fehlende getrennte Start-/Titelszenen, zu große externe Dialogbox, Optimierung von Animation und Gebäudemaßstab.
Zusätzlich erstellte Konzeptbilder: Eichenbrunn-Marktplatz mit integrierter Dialogbox, Etarium-Titelbild, Charaktereditor-Konzept. **Referenzbilder sind Designziele, kein Nachweis der Umsetzung.**

## Statusklassen / Übernahmeregel
1. **Worldbuilding-Konzept**: offene Idee, Designbild oder visueller Wunsch.
2. **Worldbuilding-Prototyp**: im Code nachprüfbar implementiert, noch nicht kanonisch.
3. **Geprüft**: Programmtest tatsächlich durchgeführt, Testmethode/Limit angeben.
4. **Kanon**: nur nach ausdrücklicher Nutzerfreigabe.
Alte Versionen beibehalten; Neues als getrennte Version testen. Keine Aussage über abgeschlossene Browser-, Hardware- oder Nintendo-DS-Tests ohne entsprechende Nachweise.

## Wiedervorlage
Regelmäßig nach dem Stand des Worldbuilding fragen: Welche Elemente sollen erprobt, verändert oder als Kanon freigegeben werden? Bestehende Änderungen dokumentieren und Konflikte mit Etarium-Kanon kenntlich machen.
