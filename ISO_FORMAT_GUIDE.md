# ISO format fuer UI und Backend (Qt/C++ + SQL)

Dieses Dokument zeigt ein robustes Muster, damit UI und Backend **denselben Zeitstandard** nutzen:

- Format: **ISO-8601**
- Zeitzone fuer API/DB-Grenzen: **UTC**
- Beispiel-String: `2026-02-11T14:23:45.123Z`

---

## 1) Eine zentrale Regel definieren

Nutze genau **eine kanonische Darstellung** fuer Datumswerte beim Speichern und bei API-Payloads:

- `YYYY-MM-DDTHH:mm:ss.SSSZ` (ISO mit Millisekunden, UTC)

Wichtig:
- Im Backend intern mit `QDateTime` arbeiten.
- An API-/Persistenzgrenzen immer in UTC serialisieren.
- In der UI fuer Menschen optional lokal anzeigen, aber den Rohwert als ISO behalten.

---

## 2) Backend: zentrale Helper-Funktionen (Qt)

Lege z. B. `src/utils/DateTimeIso.*` an und nutze die Funktionen ueberall statt ad-hoc Konvertierungen.

```cpp
// DateTimeIso.hpp
#pragma once

#include <QDateTime>
#include <QString>

namespace DateTimeIso {

inline QString toIsoUtc(const QDateTime& dt) {
    return dt.toUTC().toString(Qt::ISODateWithMs); // ...Z
}

inline QDateTime fromIso(const QString& iso) {
    QDateTime dt = QDateTime::fromString(iso, Qt::ISODateWithMs);
    if (!dt.isValid()) {
        dt = QDateTime::fromString(iso, Qt::ISODate); // fallback ohne ms
    }
    return dt.toUTC();
}

} // namespace DateTimeIso
```

### Einsatz im Repository (DB <-> Model)

Beim Lesen:
```cpp
note.setCreatedAt(query.value("created_at").toDateTime().toUTC());
note.setUpdatedAt(query.value("updated_at").toDateTime().toUTC());
```

Beim Schreiben:
```cpp
query.bindValue(":created_at", note.createdAt().toUTC());
query.bindValue(":updated_at", note.updatedAt().toUTC());
```

Hinweis:
- Wenn moeglich Datumswerte als echte DB-Zeittypen binden (`TIMESTAMP`/`DATETIME`), nicht als freie Strings.
- Falls JSON gespeichert/transportiert wird: immer `DateTimeIso::toIsoUtc(...)`.

---

## 3) API/JSON-Vertrag festziehen

Definiere klar in API-Contract/README:

- `createdAt` und `updatedAt` sind immer ISO-8601 in UTC
- Beispiel:

```json
{
  "id": 42,
  "title": "My note",
  "createdAt": "2026-02-11T14:23:45.123Z",
  "updatedAt": "2026-02-11T15:01:03.004Z"
}
```

Validierung beim Eingang:
- Parse mit `QDateTime::fromString(..., Qt::ISODateWithMs)` (plus Fallback)
- Wenn ungueltig: `400 Bad Request` / Fehlerdialog

---

## 4) UI-Regel: senden in ISO, anzeigen lokal

### Wenn UI in Qt ist

- Beim Speichern/Senden:
```cpp
payload["updatedAt"] = DateTimeIso::toIsoUtc(note.updatedAt());
```

- Bei Anzeige fuer Nutzer:
```cpp
const auto local = note.updatedAt().toLocalTime();
ui->updatedAtLabel->setText(local.toString("dd.MM.yyyy HH:mm:ss"));
```

So bleibt der Datenvertrag stabil (ISO/UTC), waehrend die Anzeige benutzerfreundlich bleibt.

### Falls du eine Web-UI (TS/JS) hast

```ts
// Senden
const updatedAt = new Date().toISOString();

// Empfangen + anzeigen
const dt = new Date(apiNote.updatedAt); // ISO => Date
const label = dt.toLocaleString();
```

---

## 5) DB-Setup (wichtig fuer Konsistenz)

- DB-Spalten als `TIMESTAMP` oder `DATETIME(3)` verwenden.
- Serverseitig UTC als Standard setzen (oder Verbindung in UTC starten).
- Trigger fuer `updated_at` sind gut, aber Zeitbasis sollte UTC sein.

Beispiel (PostgreSQL-Style Trigger ist in `schema.sql` schon angedeutet):
- Achte darauf, dass `now()` in UTC interpretiert wird (DB-/Session-Konfiguration).

---

## 6) Typische Fehler vermeiden

- Gemischte Formate (`dd.MM.yyyy`, locale strings) in API-Payloads
- Zeit ohne Zeitzone speichern
- Unterschiedliche Parser in UI und Backend
- Millisekunden mal vorhanden, mal nicht (einheitlich festlegen)

---

## 7) Mini-Checkliste fuer Umstellung

1. Alle Date-Serialisierungen suchen (`toString`, JSON builder, SQL string concat).
2. Durch zentrale ISO-Helper ersetzen.
3. API-Felder dokumentieren (`createdAt`, `updatedAt` in ISO UTC).
4. UI nur fuer Anzeige lokalisieren, nicht fuer Transport.
5. 3 Tests bauen:
   - Parse gueltiges ISO mit `Z`
   - Roundtrip (Model -> JSON -> Model)
   - Timezone-Regression (lokale TZ != UTC)

