# Selbst gehostet betreiben (Deutsch)

Diese Variante braucht weder AWS noch Alexa-hosted: Der Skill läuft als kleiner
Node-Dienst neben Audiobookshelf und wird über einen HTTPS-Proxy (z. B.
Cloudflare Tunnel) erreichbar gemacht. Alexa-Signaturen werden geprüft.

## Installation (Debian/Ubuntu, Node ≥ 18)

```bash
git clone https://github.com/<dein-fork>/abs-alexa.git /opt/abs-alexa
cd /opt/abs-alexa/lambda && npm ci --omit=dev
useradd --system --no-create-home --shell /usr/sbin/nologin abs-alexa
install -m 600 ../deploy/abs-alexa.env.example /etc/abs-alexa.env   # anpassen!
chown abs-alexa /etc/abs-alexa.env
cp ../deploy/abs-alexa.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now abs-alexa
curl -s localhost:3000/health
```

## Öffentliche Adresse

Im Tunnel einen Public Hostname anlegen, z. B. `alexa.example.com` →
`http://localhost:3000`. Endpunkt für Alexa: `https://alexa.example.com/alexa`.

## Skill in der Alexa Developer Console

1. *Create Skill* → Name „Audiobookshelf“, Sprache **German (DE)**, Typ
   *Custom*, Hosting **Provision your own**, Vorlage *Start from scratch*.
2. *Interaction Model → JSON Editor*: Inhalt von
   `skill-package/interactionModels/custom/de-DE.json` einfügen, *Save*, *Build*.
3. *Interfaces*: **Audio Player** aktivieren, erneut *Build*.
4. *Endpoint*: **HTTPS**, Default Region `https://alexa.example.com/alexa`,
   Zertifikat: *My development endpoint has a certificate from a trusted
   certificate authority*.
5. *Test*-Tab: **Development** aktivieren. Der Skill ist dann auf allen Echos
   deines Amazon-Kontos verfügbar.
6. Optional die Skill-ID als `SKILL_ID` in `/etc/abs-alexa.env` eintragen.

## Sprachbefehle (Aufrufname „mein hörbuch“)

| Aktion | Beispiel |
|---|---|
| Letztes Hörbuch fortsetzen | „Alexa, sage mein hörbuch, spiele das letzte hörbuch“ |
| Titel spielen | „Alexa, sage mein hörbuch, spiele Momo von Michael Ende“ |
| Zuletzt gehört | „Alexa, frage mein hörbuch, was habe ich zuletzt gehört“ |
| Vor/zurück | „Alexa, sage mein hörbuch, zehn Minuten zurück“ |
| Kapitel | „Alexa, sage mein hörbuch, gehe zu kapitel drei“ |
| Während der Wiedergabe | „Alexa, pause / weiter / nächstes / zurück / abbrechen“ |

Wie im englischen README: Eigene Befehle (Spulen, Kapitel) brauchen den
Aufrufnamen; Alexas globale Mediensteuerung fängt „vorspulen“ ohne ihn ab.
Fallback: „Alexa, pause“ → „Alexa, öffne mein hörbuch“ → „zehn Minuten vor“.
