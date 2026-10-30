# Etarium Worldbuilding – Kampfbefehlsmenü 04
Datum: 30.10.2026

## Referenz
Kampftest 03 bleibt unverändert als Vorgänger. Diese eigenständige Testversion übernimmt die Kampfansicht und die Initiative, Magier-Modi und Siegbedingungen; sie ergänzt eine **zweistufige Aktionssteuerung**.

## Kampfbefehle
Wenn der nächste **eigene** Magier oder Geist am Zug ist, erscheint:
- **Kampf:** normale Angriffe ohne Ätherkosten, einschließlich des experimentellen Magier-Stabstoßes (10 Schaden)
- **Magie:** kostenpflichtige Zauber sowie „Äther sammeln“ und magische Abwehr
- **Spezialfähigkeit:** Fesselzauber, Angriffsbefehl und Magier-Moduswechsel, abhängig vom Modus
- **Item:** experimenteller Heiltrank (+20 LP, 2 pro Kampf; nutzt die Hauptaktion)
- **Wechsel:** aktive Geister können in ihrem Zug gegen je einen experimentellen Reservegeist getauscht werden; auch der Magier darf im eigenen Zug einen der drei aktiven Geister durch dessen Reserve ersetzen; kein zusätzlicher Zug
- **Fliehen:** im Trainerkampf gesperrt, im separaten Wildkampf verfügbar und beendet den Testkampf sofort

Der Klick auf eine Kategorie zeigt erst die dort möglichen Handlungen. Das Anklicken einer Handlung führt sie auf ein zulässiges Ziel aus; alternativ kann im Untermenü das Ziel gewählt werden. „Zurück“ führt zur Kategorieübersicht. Nicht mögliche Befehle werden deaktiviert.

## Trainer- und Wildkampf
- Standardlink `/worldbuilding/dreifachkampf-04/`: Trainerkampf, 3 Geister + 1 Magier pro Team, Fliehen nicht möglich.
- `/worldbuilding/dreifachkampf-04/?battle=wild`: vereinfachter Wildkampf gegen einen einzelnen wilden Geist, ohne gegnerischen Magier. Flucht ist hier als erfolgreiches Testereignis umgesetzt.
- Fangmechanik ist noch **nicht** implementiert; später nur mit dafür freigegebenen Parametern und im passenden Modus.
- Items, Reservewerte, Fluchtgarantie und Stabstoß sind **ausschließlich Testfunktionen und keine verbindlichen Kanonwerte**.

## Automatische Prüfung
- 2.000 vollständige Trainerkämpfe + 2.000 vollständige Wildkämpfe
- 112.840 Einzelaktionen einschließlich 4.768 Geistwechseln, 4.908 Item-Aktionen und 1.746 Fluchten
- 4.000 abgeschlossene Kämpfe; **0 erkannte Regel- und Grenzwertverletzungen**
- Separat geprüft: Magier kann einen aktiven Geist wechseln; Reservezustand und ursprüngliche Namen/Werte werden beim Neustart zurückgesetzt.
- In isolierten UI-Interaktionstests: Kategorie Kampf aufrufen, Angriff ausführen, „Fliehen“ im Trainerkampf deaktiviert, im Wildkampf erfolgreich.
- Keine tatsächliche iPhone-Safari-Hardwareprüfung; zur Nutzerfreigabe bereit.

## Bekannte Grenzen
Die Test-Menüs enthalten noch keine finale Item-Datenbank, offizielle Reserve-/Teamverwaltung, vollständige Spezialfähigkeiten, Fangwahrscheinlichkeit oder Fluchtformel. Der Wildkampf ist derzeit eine Minimalprobe mit einem wilden Geist.
