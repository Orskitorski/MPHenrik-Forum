# My Pocket Henrik Forum!
Jag har skapat en användare åt dig Jens så att du kan testa admin-funktionerna också.
Kolla på kommentarerna på classroom för din inloggning.

## Uppföljning utifrån min planering
Jag följde nästan allting från min planering. Alla routes var samma och utförde samma uppgift. Det enda som jag ändrade var namnen på vissa saker. Såsom users tabellen som jag valde att döpa till login istället och /register routen som jag valde att döpa till /signup istället. Allting som jag planerade att göra har jag gjort. Jag hade velat hinna göra sidan mer responsiv. Detta var inte med i min planering men om jag hade mer tid över så skulle jag ha försökt anpassa den till 

## Vad? Hur? Varför?
Jag har skapat ett forum för det uppkommande hit-spelet My Pocket Henrik! Detta gjorde jag genom att återanvända koden från min Qwitter och sedan göra om mysql koden till sqlite för att kunna hosta sidan på Glitch. De flesta funktionerna jag behövde hade vi redan gjort på Qwitter såsom login, signup och en sida som visar alla posts. Utöver detta så fixade jag också säkerhet till sidan genom att använda express validator för att sanera och validera all insamlad data från formulär och url:s. I detta forum kan endast admins lägga upp nyheter och vanliga användare kan kommentera på dessa. Dessutom kan användare redigera och ta bort sina egna posts. Jag har även försökt designa denna sida med hjälp av css. 

## Hur har jag testat min produkt?
Josua.

När jag hostade min webbsida på glitch för första gången så gav jag Josua länken efter att han frågat. HAN FÖRSTÖRDE ALLT!!! Han lyckades komma åt mina post routes (jag visste inte att man kunde göra det). Så jag blev tvungen att fixa sanering och validering på post routesen också för att förhindra framtida angrepp (Tack Josua).

Under tiden jag försökte fixa ett problem med kommentarerna så hade jag även en /test route som visade upp alla kommentarer så att jag enklare kunde visualisera databasen.

Själva visuella delen av projektet testade jag med WAVE. Det mesta som den klagade på var kontrastfel på grund av min användning av vit som textfärg med en ganska ljus bakgrundsfärg på till exempel knappar. 

Jag har även testat mobilkompatibiliteten med hjälp av webbläsarens inbyggda inspect funktion vilket gör att man kan kolla hur hemsidan ser ut för olika upplösningar. Jag lyckades lägga till en media query som förstorar font-sizen när bredden på upplösningen är under 1000px. Detta eftersom texten annars skulle vara för liten för att läsa på mobil.

## Säkerhet
Det finns 3 olika rättighetsnivåer på min webbplats: Guest (inte inloggad, kan se nyheter och kommentarer), User (inloggad, kan göra allting guest kan, kan lägga kommentarer på nyheter, kan ta bort och redigera sina egna kommentarer), och Admin (inloggad, kan göra allting som user kan, kan ta bort alla kommentarer, kan lägga upp nyheter, kan ta bort och redigera nyheter). Jag har använt mig av express-validator för att validera och sanera data som insamlats från formulär och url:s. Detta är viktigt för att förhindra personer (Josua) från att komma åt databasen och kunna ändra på saker utan att admins vet om det och eventuellt förstöra sidan.