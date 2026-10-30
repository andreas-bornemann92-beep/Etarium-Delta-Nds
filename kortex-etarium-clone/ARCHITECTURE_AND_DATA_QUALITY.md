# Kortex-Etarium-Clone – Prüf- und Trainingsplan

Isolierter Entwicklungsbranch. Der ursprüngliche Kortex, GitHub main und Etarium V17/V18 bleiben unverändert.

## Datenbasis (lokal, Stand 2026-10-30)
863 Einträge, 891 Knoten, 1.219 Kanten, 12 konfigurierte Agentenrollen.
350 Felder mit nicht verifizierten Einzelwerten, 0 doppelte IDs, 0 Kanten mit fehlenden Endpunkten.
Die vollständige Matrix wird separat als ZIP ausgeliefert, nicht automatisch mit GitHub synchronisiert.

## Konzeptionelles Modell
Quellgruppierter Train/Validation/Test-Split, Tokenmerkmale / Embeddings,
MLP 128→64→Softmax, ReLU, Dropout 0.2, Adam mit LR 0.001,
Seed 20261030, max. 40 Epochen, Early Stopping Macro-F1.

## Kein fingiertes Training
Es gibt keine Gewichte, Metriken oder dokumentierte Trainingsläufe.
Für echte Modelltests werden Dateien und eine reproduzierbare Trainingsumgebung benötigt.

## Konflikte
- Magier ohne Waffen vs. frühere Stab-Darstellung.
- Verbindliche Grundfigur vs. ältere Platzhalter.
- Historisch gemeldete Testzahlen ohne unabhängige Logs.
- Wissensgraph ist kein trainiertes neuronales Netz.

## Testumfang
Der Repo-Smoke-Test prüft Rollen, Branch-Isolation und Aufbewahrung der V17/V18-Referenzen.
Vollständige Graphprüfungen laufen lokal mit `analyze_clone.py` und `test_kortex_graph.py`.
