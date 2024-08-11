

# HypeHost - Bot Discord

![GitHub release (latest by date)](https://img.shields.io/github/v/release/k4huu/hypehost-bot-discord)
![GitHub all releases](https://img.shields.io/github/downloads/k4huu/hypehost-bot-discord/total)
![GitHub issues](https://img.shields.io/github/issues/k4huu/hypehost-bot-discord)
![GitHub pull requests](https://img.shields.io/github/issues-pr/k4huu/hypehost-bot-discord)
![GitHub stars](https://img.shields.io/github/stars/k4huu/hypehost-bot-discord?style=social)

Witamy w **HypeHost** – niezastąpionym bocie Discord, który podniesie poziom Twojego serwera! Niezależnie od tego, czy zarządzasz społecznością graczy, grupą naukową, czy po prostu spędzasz czas ze znajomymi, HypeHost ma coś dla każdego.

## 🌟 Komendy i eventy bota

- **Weryfikacja:** Weryfikacja pod modal menu z prostym działaniem matematycznym.
- **Komendy administracyjne:** Komendy takie jak `/kick`, `/ban`, `/mute`, `/unmute`, `/warn`.
- **Ticket:** System ticketów w select menu.
- **Propozycje:** Ładne propozycje w embedzie.
- **Antilink:** System antylinkowy.

## 🔧 Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/k4huu/hypehost-bot-discord.git
   ```
2. Zainstaluj wymagane zależności:
   ```bash
   npm install axios@1.7.3 colors@1.4.0 discord-html-transcripts@3.2.0 discord.js@14.15.3 googleapis@140.0.1 moment-duration-format@2.3.2 moment@2.30.1 torch@0.2.7
   ```
3. Skonfiguruj swoje dane w pliku `config.json`:
   ```json
   {
     "token": "TWÓJ_TOKEN",
     "clientId": "ID_KLIENTA",
     "guildId": "ID_GUILD",
     "statuses": [
       { "name": "Pomagam!", "type": "PLAYING" },
       { "name": "Oglądam serwer", "type": "WATCHING" },
       { "name": "Tworzę nowe funkcje", "type": "COMPETING" },
       { "name": "Witam nowych członków", "type": "LISTENING" }
     ],
     "proposalChannelId": "ID_KANAŁU_PROPOZYCJI",
     "verificationRoleId": "ID_ROLI_WERYFIKACYJNEJ",
     "logChannelId": "ID_KANAŁU_LOGÓW",
     "ticketRoleId": "ID_ROLI_TICKETÓW",
     "welcomeChannelId": "ID_KANAŁU_WITAJĄCEGO",
     "goodbyeChannelId": "ID_KANAŁU_POŻEGNALNEGO",
     "serverName": "NAZWA_SERWERA",
     "welcomeMessage": "Cieszymy się, że dołączyłeś do naszego serwera! Baw się dobrze!",
     "goodbyeMessage": "Mamy nadzieję, że wrócisz do nas w przyszłości!"
   }
   ```
4. Uruchom bota:
   ```bash
   node main.js
   ```

## 🛠 Kontrybucje

Chcesz pomóc rozwijać HypeHost? Każdy wkład jest mile widziany! Zgłaszaj problemy, proponuj zmiany lub przesyłaj pull requesty.

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT – zapoznaj się z plikiem [LICENSE](LICENSE), aby uzyskać więcej informacji.

---

Pamiętaj, aby dostosować wartości w pliku `config.json` do swojego środowiska przed uruchomieniem bota.
