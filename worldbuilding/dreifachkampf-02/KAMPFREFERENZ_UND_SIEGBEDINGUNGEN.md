# Etarium – verbindliche Referenzdemo für Kampftests
Stand: 30.10.2026
Pfad: `worldbuilding/dreifachkampf-02/`

## Festlegung
Der Nutzer hat die Bedienung und Funktion dieser Demo ausdrücklich bestätigt. **Dreifachkampf 02 ist der UI- und Funktions-Ausgangspunkt für folgende Kampfsystemtests.** Neue Änderungen sollen diese Referenz nicht ohne separate Tests beschädigen.

## Bereits festgelegte Sieg-/Niederlageregeln
Ein Team verliert sofort, sobald **einer** dieser Fälle eintritt:
1. Der **eigene Magier** erreicht **0 LP** (K. o.), auch wenn noch Geister kampffähig sind.
2. **Alle drei eigenen aktiven Geister** erreichen **0 LP**, auch wenn der Magier noch LP besitzt.

Das andere Team gewinnt unmittelbar. Das vorherige 12-Runden-Limit mit Summenvergleich der LP wurde entfernt; ein Kampf endet nun durch diese K.-o.-Bedingungen. Der entscheidende Grund wird als `defeatReason` (`mage` oder `spirits`) im Zustand ausgegeben.

## Abgrenzung
Die übergeordneten Regeln für aktive und passive Magier sind bereits im Etarium-Konzept definiert, aber **noch nicht Bestandteil dieser Demo**. Aktuell sind beide Magier angreifbar. Bei späterer Einführung des Passiv-Modus müssen Angriffsziele entsprechend gesperrt werden. Zahlenwerte der Testfiguren und 1–3 aktive Geister bleiben experimentell, bis weitere Freigabe erfolgt.

## Verifikation
- **3.000 vollständige Kämpfe**, **62.503 Aktionen**.
- **2.237** Kampfausgänge durch Magier-K. o., **763** durch K. o. aller drei Geister.
- **0** protokollierte Regelverletzungen bei Ausgangsgrund, LP/Äthergrenzen oder Kampffortschritt.
- Keine neue tatsächliche Safari- oder Hardwareprüfung; technische Tests in JavaScript.
