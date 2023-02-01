### This App was made for Mozio's coding challenge

### Started on 25 of January of 2023 

### To do list
> Component testing, e2e testing with jest enzyme and puppeteer.

> Refactor types :any and create missing interfaces.

### How it works:
> Complete the different inputs of the form and click submit to receive the trip distances.

> The city inputs search the cities by complete match I.E `"Paris" === "Paris true . "Paris" === "Par" false` (thats what I understood in the task, to change the condition see `getCitiesByName` in src/api/action.ts).

> The same inputs take 1 second to make the mocked petition by a debounce function and another one to load the cities, taking a total of 2 seconds.

> If the keyword "fail" (case insensitive) is inputted on any city input, it will return an alert.

> If the city "Dijon" is used, the calculation on /search-results will return an error too.

> You can find the mock database in src/api/mock-cities.ts

### Take in mind that I didn't have the time that I would have desired to complete everything as clean as I would, normally. (as I also have a full time job :S)

### Thank you for reading!

