# My Pocket Henrik Forum!
Jag har skapat en användare åt dig Jens så att du kan testa admin-funktionerna också.
Kolla på kommentarerna på classroom för din inloggning.

## Uppföljning utifrån min planering
Jag följde nästan allting från min planering. Alla routes var samma och utförde samma uppgift. Det enda som jag ändrade var namnen på vissa saker. Såsom users tabellen som jag valde att döpa till login istället och /register routen som jag valde att döpa till /signup istället. Allting som jag planerade att göra har jag gjort. Jag hade velat hinna göra sidan mer responsiv. Detta var inte med i min planering men om jag hade mer tid över så skulle jag ha försökt anpassa den till 

## Vad? Hur? Varför?
Jag har skapat ett forum för det uppkommande hit-spelet My Pocket Henrik! I detta forum kan endast admins lägga upp nyheter och vanliga användare kan kommentera på dessa. Dessutom kan användare redigera och ta bort sina egna posts. Jag har även försökt designa denna sida med hjälp av css. Jag använde mig av express-validator för att sanera insamlad data.

## Hur har jag testat min produkt?
Josua.
När jag hostade min webbsida på glitch för första gången så gav jag Josua länken efter att han frågat. HAN FÖRSTÖRDE ALLT!!! Han lyckades komma åt mina post routes (jag visste inte att man kunde göra det). Så jag blev tvungen att fixa sanering och validering på post routesen också för att förhindra framtida angrepp (Tack Josua).

## Säkerhet
Det finns 3 olika rättighetsnivåer på min webbplats: Guest (inte inloggad, kan se nyheter), User (inloggad, kan se nyheter, kan lägga kommentarer på nyheter, kan ta bort och redigera sina egna kommentarer), och Admin (inloggad, kan se nyheter, kan lägga upp kommentarer, kan ta bort alla kommentarer, kan lägga upp nyheter, kan ta bort och redigera nyheter). Jag har använt mig av express-validator för att validera och sanera data som insamlats från formulär och url:s