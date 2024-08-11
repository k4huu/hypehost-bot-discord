
# HypeHost - Bot Discord

![GitHub release (latest by date)](https://img.shields.io/github/v/release/twoj-uzytkownik/hypehost)
![GitHub all releases](https://img.shields.io/github/downloads/twoj-uzytkownik/hypehost/total)
![GitHub issues](https://img.shields.io/github/issues/twoj-uzytkownik/hypehost)
![GitHub pull requests](https://img.shields.io/github/issues-pr/twoj-uzytkownik/hypehost)
![GitHub stars](https://img.shields.io/github/stars/twoj-uzytkownik/hypehost?style=social)

Witamy w **HypeHost** – niezastąpionym bocie Discord, który podniesie poziom Twojego serwera! Niezależnie od tego, czy zarządzasz społecznością graczy, grupą naukową, czy po prostu spędzasz czas ze znajomymi, HypeHost ma coś dla każdego.

## 🌟 Komendy i eventy bota

- **Weryfikacja:** Weryfikacja pod modal menu z prostym działaniem matematycznym.
- **Komendy administracyjne:** Chyba nie musze tłumaczyc komendy /kick /ban /mute /unmute /warn.
- **Ticket:** System ticket w select menu.
- **Propozycje:** Ladne propozycje w embed.
- **Antilink:** Antylink.

## 🔧 Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/k4huu/hypehost.git
   ```
2. Zainstaluj wymagane zależności:
   ```bash
   npm install
   ```
3. Skonfiguruj swoje dane w pliku `config.json`:
   ```bash
{
  "token": "",
  "clientId": "",
  "guildId": "",
  "statuses": [
    { "name": "Pomagam!", "type": "PLAYING" },
    { "name": "Oglądam serwer", "type": "WATCHING" },
    { "name": "Tworzę nowe funkcje", "type": "COMPETING" },
    { "name": "Witam nowych członków", "type": "LISTENING" }
  ],
  "proposalChannelId": "",
  "verificationRoleId": "",
  "logChannelId": "",
  "ticketRoleId": "",
  "welcomeChannelId": "",
  "goodbyeChannelId": "",
  "serverName": "",
  "welcomeMessage": "Cieszymy się, że dołączyłeś do naszego serwera! Baw się dobrze!",
  "goodbyeMessage": "Mamy nadzieję, że wrócisz do nas w przyszłości!"
}

   ```
4. Uruchom bota:
   ```bash
   npm start
   ```

## 🛠 Kontrybucje

Chcesz pomóc rozwijać HypeHost? Każdy wkład jest mile widziany! Zgłaszaj problemy, proponuj zmiany lub przesyłaj pull requesty.

## 📄 Licencja

Ten projekt jest dostępny na licencji MIT – zapoznaj się z plikiem [LICENSE](LICENSE), aby uzyskać więcej informacji.

---

Ten README zawiera wszystkie podstawowe informacje, które użytkownik potrzebuje, aby zainstalować i korzystać z bota HypeHost na swoim serwerze Discord. Widgety na górze dodają dodatkowe informacje, takie jak liczba pobrań, liczba zgłoszonych problemów i gwiazdek na GitHubie. Upewnij się, że zastąpisz "twoj-uzytkownik" swoją nazwą użytkownika GitHub oraz dostosujesz linki i komendy
