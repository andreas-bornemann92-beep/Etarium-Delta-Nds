# Worldbuilding – Kampftest 02: Magier und Geister
Status: **separater Testprototyp** (nicht Etarium-Kanon). Basis: funktionierender Kampftest 01.

## Inhalte
- Zwei Geister und **zwei Magier** (Spieler-Magier, Magier Kael), alle auf dem Kampfbildschirm dargestellt.
- Vier Akteure handeln einzeln: Geist/Geist/Magier/Magier, die startende Teamseite wird zu Kampfbeginn ausgelost.
- Spieler steuert den eigenen Geist und Magier nacheinander über dasselbe Touchmenü.
- Magier-Fertigkeiten: Funkenstoß (14 Schaden), Heillicht (16 LP beim Geist), Schutzkreis (12 Schadensabsorption).
- Gegner-Magier: Arkanstoß, Genesung und Barriere mit einfachen gewichteten Entscheidungen. Gegnergeist behält Angriff/Magie/Schutz.
- Vier getrennte LP-Anzeigen, geschützte Zugzustände, Touch-Tasten ◀/▶/A/START, KI zieht selbständig.
- Maximal zehn Runden in dieser isolierten Version, Sieg durch K.o. des ganzen Teams oder LP-Vergleich bei Zeitlimit.

## Prüfungen
- Syntaxprüfung der Engine und des eingebetteten Browser-JavaScript: bestanden.
- Start mit beiden möglichen ausgelosten Teamreihenfolgen: bestanden.
- Je 40 aufeinanderfolgende individuelle Aktionen über 10 Runden in beiden Starts: bestanden.
- Keine doppelte Aktion eines Akteurs in derselben Runde: bestanden.
- Kampfausgang und LP-Berechnung in den simulierten Fällen: bestanden.
- Keine reale iPhone-Safari- oder Nintendo-DS-Hardwareprüfung durchgeführt.

## Abgrenzung
Die Magier-Aktionen sind **Worldbuilding-Testwerte** und bilden noch nicht die endgültigen Magierklassen, Ätherkosten, Magier-Modi oder Ausfallregeln ab. Kampftest 01 bleibt unverändert erreichbar.
