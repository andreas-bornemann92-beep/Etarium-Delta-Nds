# Worldbuilding – Kampftest 01

**Stand:** 30. Oktober 2026
**Kategorie:** Worldbuilding-Prototyp, kein verbindlicher Kanon
**Einstieg:** `worldbuilding/kampftest/index.html`

## Übernommene Konzepte
- Sofortiger Kampfbeginn ohne Hauptspiel, Editor oder Stadt.
- Klassische Perspektive: eigener Geist unten von hinten, Gegner oben gegenüber.
- Per Zufall beginnt entweder der Spieler oder der Gegner.
- Ein Zug pro Beteiligtem je Runde, danach erneute Runde in derselben Reihenfolge.
- Spieler: Angriff (16 Schaden), Magie (22 Schaden), Schutz (reduziert nächsten Treffer um 12).
- Gegner-KI: Steinschlag, Funkenschauer oder Abwehr; einfache gewichtete Auswahl.
- Kampffeld, LP-Anzeigen, Initiativ-/Rundenanzeige, Statusmeldung und Aktionsmenü sind getrennt.
- Touch-Menü/virtuelle Richtungstasten: Links/Rechts zur Aktionswahl, A zum Bestätigen, START zum Neustart. Tastatur: Pfeiltasten, A/Enter, R/S.
- Einzeln animierter Gegenzug mit kurzer Verzögerung; Spieleraktionen während Gegenzug gesperrt.
- Kampfhistorie aufklappbar, maximal acht Runden im Prototyp, danach LP-Vergleich; bei 0 LP Ende.

## Prüfergebnisse
1. JavaScript-Syntaxprüfung der Kampftestseite erfolgreich.
2. Deterministischer Starttest für Spieler zuerst und Gegner zuerst erfolgreich.
3. Abwechselnde Züge jeweils 16 Aktionen über acht Runden ohne Doppelzüge erfolgreich.
4. Handlung und LP-Änderungen wurden bei jedem simulierten Zug geprüft.
5. Gegnersimulation mit Ablauf über zeitgesteuerten Rückruf erfolgreich.
6. Neustart nach Kampfausgang bei beiden Startreihenfolgen erfolgreich.
7. Touch-Buttons im DOM-Simulationstest angeschlossen und Zustände geprüft.

**Einschränkung:** Die Tests liefen in einer simulierten DOM-/JavaScript-Laufzeit. Ein echter Safari-Gerätetest und eine Nintendo-DS-ROM wurden für diesen Kampftest nicht bestätigt.

## Weitere offene Worldbuilding-Prüfpunkte
- Kampfanimationen je Attackentyp, Geister- und Magierdarstellung verbessern.
- Wirkliche Touch-/Joystick-Bedienung auf dem iPhone prüfen.
- Gegner-KI, Initiative, Schadensformeln, Ätherkosten und Balancing erst später kanonisieren.
- Anbindung an Etarium-Hauptspiel nur nach Freigabe.
