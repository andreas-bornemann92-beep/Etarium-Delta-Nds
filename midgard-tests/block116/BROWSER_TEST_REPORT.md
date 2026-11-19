# Midgard Block 116 – Browser-Prüfprotokoll (2026-11-19)

Projekt: **MIDGARD MONSTERS**. Isolierter Testzweig; ETARIUM-Hauptstand unverändert.

## Tatsächlich ausgeführt
- Die unveränderte vollständige Block-116-HTML-Datei (39.393.445 Bytes) wurde in lokalem Chromium über Playwright `page.set_content` geladen. Ein direkter `file://`-Aufruf war durch `ERR_BLOCKED_BY_ADMINISTRATOR` gesperrt.
- Demo-Start, automatische Einführung, Aktivierung des Kampfbefehlsmenüs und Teammenü tatsächlich im Browser geprüft.
- Startauswahl „Heldin / Eikel“: aktives Monster **Eikel**, sichtbarer Sprite-Key `eikel_spieler`; Intro-Endstatus `ready`.
- Tatsächlicher Menüwechsel: Start-Klabuni (Teamplatz 2) → Teammenü → Eikel (Teamplatz 1) → **MONSTER WECHSELN**. Nach dem Wechsel: `activeName=Eikel`, `activeIndex=0`, sichtbarer Sprite-Key `eikel_spieler`; keine Browser-JavaScript-Fehler.
- Alle vier Hauptaktionen waren nach dem Intro als separate Bedienelemente vorhanden.

## Nicht bestanden oder noch nicht nachgewiesen
- Der Test eines Pflichtwechsels nach K. o. ist **NICHT_VERIFIZIERT**. Ein Versuch zum künstlich gesetzten niedrigen KP-Wert und anschließendem Angriff brach wegen eines Browser-Transport-Zeitlimits ab.
- Kein tatsächlicher Test mit iOS Safari.
- GitHub Actions hat bisher nur isolierte extrahierte Wechsel-/K.-o.-Funktionen ausgeführt; die vollständige 38-MB-HTML wurde **nicht** ins Repository übertragen. GitHub führt noch **keinen** echten Full-Demo-Browsertest aus.

## Folgeprüfung (offen)
Vollständige HTML auf isolierten GitHub-Testzweig bereitstellen (nicht ETARIUM main) und Playwright-Tests ausführen: Startauswahl, Intro-Sperre, Teamwechsel mit Sprite-Synchronisation, erzwungener Wechsel nach echtem K. o., Menüfreigabe, Konsolenfehler und iPhone-Hochformat-Layout.

Referenz im lokalen Arbeitskontext: `Monsters_Midgard_Block116_Monsterwechsel_Repariert.html`.