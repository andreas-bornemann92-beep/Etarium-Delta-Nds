# Kortex – Lernmatrix: Sprache und Dialog
Stand: 30.10.2026
Projekt: Etarium

## Inspirationsquellen und Abgrenzung
- ink (inkle): Dialogknoten, Auswahlmöglichkeiten, Sprünge, Wiederaufnahme. https://www.inklestudios.com/ink/
- ink-Handbuch: Zustände, bedingte Auswahlen und Verzweigungen. https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
- Game Developer: lineare NPC-Aussagen, optionale Rückfragen, Verzweigung und Rückführung. https://www.gamedeveloper.com/design/defining-dialogue-systems
- KEINE wörtlichen Dialoge oder Figuren aus anderen Spielen übernommen. Alle 100 deutschen Texte sind neu für Etarium formuliert.

## Architektur
4 NPC-Gruppen × 25 Textknoten = **100 eigenständige Dialogtexte**.
- Mara: persönlich, einladend, 25 Knoten, Auswahl und Folgegespräche.
- Toren: knappe Patrouillenmeldungen und optionale Rückfragen, 25 Knoten.
- Elis: passive Prüferin, Bericht mit optionaler Nachfrage und Ergebnisflag `brunnen_geprueft`, 25 Knoten.
- Kael: Trainer, freiwillige Herausforderung und Übergang zur bestehenden Kampfsimulation `kampf_starten`, 25 Knoten.

Jeder Knoten: id, npc, text, type, next, choices. Wählbare Optionen enthalten label, next, optional effect.
Einzeltext → Weiter/Schließen. Dialog → bis zu vier Optionen. Geschlossene Gespräche werden beim nächsten Ansprechen neu gestartet.
Die ursprünglichen NPC-Positionen, Kampf-, Gebäudebetretungs- und Spielmechaniken bleiben erhalten.

## Lernmatrix der Gesprächsmuster
| Muster | Umsetzung |
| --- | --- |
| Einzelsatz / Bark | Toren und lineare Knoten |
| NPC-Erzählung ohne Optionen | Fortlaufender Knoten mit Weiter |
| Spielerantworten | Auswahlknoten Mara, Elis, Kael |
| Mehrstufiger Pfad | Option → Unterknoten → nächste Antwort |
| Themen-Navigation | Rücksprung zum Einstieg |
| Revisit | Wiederholtes Ansprechen setzt Wurzelknoten |
| Konsequenz | Flags und Kampfstart-Effekt |
| Unterschiedliche soziale Rollen | Begrüßung, Kontrolle, Untersuchung, Kampftraining |
| Sichere Rückkehr | B schließt den Dialog, ohne Zustand zu beschädigen |

## Testkriterien
1. Exakt 100 Textknoten, 25 pro Figur.
2. Alle `next`- und `choice.next`-Verweise existieren.
3. Jeder NPC hat einen Einstiegsknoten.
4. Dialog-Menü kann A und B bedienen.
5. Elis' Ergebnisflag wird gesetzt.
6. Kaels Kampfoption startet die vorhandene Kampfvorschau.
7. Kein fremder NPC erhält Dialoge einer anderen Figur.
8. App-Start nach dem Charaktereditor bleibt möglich.

**Status:** Inhalt und Validierungsfunktionen programmiert; echter Safari-Lauf noch nicht bestätigt.
