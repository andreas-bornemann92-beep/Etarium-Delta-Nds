# ETARIUM MOBILE P – Kortex Qualitätsprotokoll
Datum: 29.10.2026
Projekt: Etarium Delta, HTML5/Safari

## Ursache / Diagnose
- Fehlerbild: Benutzer erreicht Charaktereditor, Spielwelt erscheint danach nicht.
- In Mobile O war die Modulreferenz `npcs` ursprünglich nicht initialisiert, obwohl `reset()`, `render()` und `interact()` diese verwenden.
- Eine Korrektur wurde auf O geschrieben, aber auf dem iPhone vom Nutzer weiterhin als fehlerhaft gemeldet.
- Wegen fehlender echter Browser-Testresultate wird diese Korrektur **nicht** als ausreichend bestätigt angesehen.

## Version P – Architekturmaßnahmen
1. Alle Module als versionierte eigenständige Dateien in `p/` (Stadt, NPCs, Editor, Spiel).
2. Vor dem Spielstart prüfen, ob Stadt-, NPC- und Editor-Modul geladen sind.
3. Einstieg `Charaktereditor → startFresh → validateStart → world → save` mit Fehlerbehandlung.
4. Einheitliche `etariumFatal`-Anzeige: Fehler nicht mehr still verschlucken.
5. Grafikloop mit `safeRender` und diagnostischen Bildzählern.
6. Eigener Spielstand unter `etarium_mobile_p_save_v1`; N und O bleiben unverändert.
7. Root-Einstieg `etarium-p.html`, alternativer Unterordner `p/`.
8. Eigenständige Browser-Testseite `p/test.html` + Playwright-Szenario `p/smoke.cjs`.
9. Automatisierungs-Workflow `.github/workflows/mobile-p-qa.yml`.

## Nachprüfbare Ergebnisse
| Prüfung | Ergebnis | Beleg |
| --- | --- | --- |
| JavaScript-Syntaxprüfung der vier Module | bestanden | V8 Function-Kompilierung |
| Titelmenü → Editor → Welt | bestanden | DOM-Laufzeitsimulation |
| Startkoordinaten | bestanden | (24,32) |
| Animationsbilder | bestanden | 18 vorberechnete Frames |
| Renderloop | bestanden | 32 simulierte Renderdurchläufe |
| NPC-Typen | bestanden | Mara, Toren, Elis |
| Toren-Routenfortschritt | bestanden | Route 4, Position (29,19) |
| Mara-Dialog | bestanden | A-Interaktion |
| Elis-Befragung | bestanden | `checked=true` und Ergebnis vorhanden |
| Start-/Select-Menüs | bestanden | DOM-Laufzeitsimulation |
| Echte Chromium-Browserautomatisierung | **nicht bestätigt** | GitHub Actions bislang kein Workflow-Lauf auf Commit |
| Safari/iPhone-Praxistest | **ausstehend** | Benutzerprüfung nötig |
| Öffentliche Pages-Erreichbarkeit | **nicht bestätigt** | kein Webzugriff im Prüftool |

## Delta-Lernmatrix
- **E06**: Erfolgreicher Build ist kein Laufzeitbeleg → deshalb UI-/Spielstartprüfung zwingend.
- **S2-03**: Update, Rendering, Eingaben getrennt beobachten; Renderloop darf nicht still stoppen.
- **S2-04**: Zustände für Titel, Editor, Welt isoliert prüfen.
- **S2-05**: Browser-Simulation bestätigt Grundfunktion, ersetzt aber nicht Safari.
- Testsystem meldet `bestanden`, `fehlgeschlagen` oder `nicht bestätigt` getrennt.

## Abnahmeanweisung
1. Root-Einstieg `etarium-p.html` auf dem iPhone öffnen.
2. Neues Spiel, Geschlecht/Körperbau wählen, Abenteuer beginnen.
3. Prüfen, ob Eichenbrunn und 3 NPCs sichtbar sind.
4. Zu Mara gehen, A-Dialog testen.
5. Elis aufsuchen, A-Abfrage durchführen.
6. Bei Fehler: Text der eingeblendeten Fehlermeldung notieren.
7. Optional: `p/test.html` im Browser öffnen und Kortex-Testlabor starten.
