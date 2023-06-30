English


Installation of my site:

1. version 3.2.6 (or higher) of the plguin is needed
2. if a previous version of my site was used, please delete it and all variables that came with the previous version as well
3. import the current page with all values


Usage of the page:

For the page to work properly the key assignments in the game needs to be adjusted to my plugin, or vice versa.

Some values only change when you are in the game and the value in the game also changes (Odometer e.g.). Most values are queried as soon as one minute of ingame time has passed or the speed of the truck is at least 1. Therefore it can be that some values first are available only after a short time.

The following values can be tapped in Touch Portal (smartphone / tablet) to query the current value:
Page 1: Odometer, Estimated Time, Estimated Distance, Next Rest In, Remaining Job Time, Job Destination, Fuel Gauge.
Page 2: Source City, Destination City, Source Company, Destination Company, Remaining Job Time


Cruise control automatic

There is a button, Cruise Control Automatic, in the lower left corner. As soon as this is activated, the set speed of the cruise control is automatically adjusted to the maximum allowed speed while cruise control is activated. When using this function, the automatic mode should be turned on first and then cruise control should be activated. If the maximum speed changes while cruise control is on, the truck will automatically adjust the set speed of cruise control to the new maximum allowed speed. Please set the cruise control step size to 5 kmh/mph, in the game options, to use this feature.

Setting units

Please set all units on page 2 under Unit Switches as they are set in the game. Just press the corresponding button and the unit will be changed.
The plugin can handle liters as well as UK gallons and US gallons. Please set the corresponding unit in the pluginsettings (Unit Switches) on page 2 (Fluids). And then in Consumption (CNSPT) set the corresponding unit again.


Fuel gauge

The fuel gauge shows the remaining fuel as a bar and as a number. It also shows the average consumption (AVG - depending on the units set) and the estimated distance until the tank is empty. (DTE)
For the fuel gauge to work correctly, an entry must be made here. It can happen that if you upgrade the gas tank in a truck to the largest tank, the game does not output the correct value for the maximum tank capacity to the plugin. This is a bug in the game that has not been fixed yet. Therefore here in Touchportal (on the PC) at On Pressed in line 2 - (Set Value with id Fuelcap to value) in the field on the right with the plus sign, please enter the current maximum tank capacity of your truck (in liters, US gallons or UK gallons depending on the settings), and then click save. If you enter 0, the button will take the value given by the game. Then tap the fuel gauge on your smartphone or tablet once. Now the value for the current session is saved. If Touch Portal is restarted, the units are changed or the truck is changed in between, please repeat this procedure and tap the button again. When changing units, remember to specify the maximum tank capacity in the new unit.


Auto refuel

This button holds down the key that is assigned in the game under "Keys and Buttons" as "Activate" (please assign the same key in the game as in the plugin). The button changes to ON. As soon as the maximum fuel capacity is reached, the button is automatically released. The button changes to OFF.


Wipers, Gear Select, Motorbreak

For the wipers I set 2 keys in game: Wipers Back (Numpad /) und Wipers (P) - and the 
For motorbreaklevel I set 2 keys ingame: increase (Numpad+) decrease (Numpad -)
For gear automatic I set the following keys ingame: shift down (right ctrl), shift up (right Shift) und auf shift to neutral (comma)


Page2

If the Button "Page 2" does not work, please click on the Button in Touch Portal PC and under "On Pressed - Go to page" please set my second page.



Deutsch

Installation meiner Seite:

1. Es wird Version 3.2.6 (oder höher) des plguins benötigt
2. Wenn eine vorherige Version meiner Seite benutzt wurde, diese bitte löschen und alle Variablen die mit der vorherigen Version gekommen sind bitte auch
3. Die aktuelle Seite mit allen Values importieren


Bentuzung der Seite:

Damit die Seite einwandfrei funktioniert müssen die Tastenzuweisungen im Spiel an mein Plugin angepasst werden, oder umgekehrt.


Einige Werte ändern sich erst wenn man im Spiel ist und sich der Wert im Spiel auch ändert (Kilometerzähler z.B.). Die meisten Werte werden abgefragt sobald im Spiel eine Minute Ingamezeit vergangen ist, oder die Geschwindigkeit des Trucks mindestens 1 beträgt. Daher kann es sein dass einige Werte erst nach kurzer Zeit verfügbar werden.

Folgende Werte können im Touch Portal (Smartphone / Tablet) angetippt werden um den Aktuellen Wert abzufragen:
Seite 1: Odometer, Geschätze Fahrtdauer, Geschätzte Distanz, Nächste Ruhepause, Restzeit(Job), Zielort, Tankanzeige
Seite 2: Quell Stadt, Zeil Stadt, Quell Firma, Zielfirma, Verbleibende Job Zeit

Tempomat Automatic

Es gibt Links unten einen Button Tempomat Automatik. Sobald dieser Aktiviert ist wird die eingestellte Geschwindigkeit des Tempomaten automatisch an die maximal erlaubte Höchstgeschwindigkeit angepasst, während der Tempomat aktiviert ist. Bei Benutzung dieser Funktion sollte die Automatik zuerst eingeschaltet werden und dann der Tempomat aktiviert werden. Sollte sich bei angeschaltetem Tempomat die Höchstgeschwindigkeit ändern, passt der Truck automatisch die eingestellte Geschwindigkeit des Tempomaten an die neue maximal erlaubte Höchstgeschwindigkeit an. Bitte die Tempomatschrittgröße auf 5 kmh/mph stellen, in den Spieloptionen, um diese Funktion nutzen zu können.



Einheiten Einstellen

Bitte auf Seite 2 unter Unit Switches alle Einheiten so einstellen wie im Spiel eingestellt. Dazu einfach den zugehörigen Button drücken dann wird die Einheit umgestellt.
Das Plugin kann sowohl mit Litern als auch mit UK Gallonen und US Gallonen umgehen. Bitte in den Pluginsettings (Einheiten Umstellen) auf Seite 2 die entsprechende Einheit unter Flüssigkeiten einstellen. Und dann bei Verbrauch die entprechende Einheit nochmals einstellen.


Tankanzeige

Die Tankanzeioge zeigt den Füllstand des Tanks an, als Balken und als Zahl. Sie Zeigt auch den Durchschnitlichen Verbrauch an (AVG - je nach eingestellter Einheiten) und die Geschätze Distanz bis der Tank Leer ist. (DTE)
Damit die Tankanzeige korrekt funktioniert muss hier ein Eintrag vorgenommen werden. Es kann vorkommen dass, wenn man in einem Truck den Benzintank auf den größten Tank upgraded, das Spiel nicht den richtigen Wert für für die maximale Tankfüllung ausgibt an das Plugin. Das ist ein Bug im Spiel der bisher nicht gefixed wurde. Darum hier im Touchportal (auf dem PC) bei On Pressed in Zeile 2 - (Set Value with id Fuelcap to value) als Value (Feld rechts mit dem Pluszeichen) bitte die aktuelle maximale Tankfüllung eintragen (in Liter, US Gallonen oder UK Gallonen je nach Einstellung), und dann Save anklicken. Wenn dort eine 0 eingetragen wird dann nimmt der Button den Wert den das Spiel vorgibt. Danach die Tankanzeige auf dem Smartphone oder Tablet einmal antippen. Nun ist der Wert für die aktuelle Session gespeichert. Sollte Touch Portal neu gestartet werden, die Einheiten umgestellt oder der Truck zwischendurch gewechselt werden, diese Prozedur bitte wiederholen und den Button erneut antippen. Beim Einheitenwechsel daran denken die maximale Tankfüllung in der neuen Einheit anzugeben.


Tankautomatik

Dieser Button hält die Taste die im Spiel unter "Tasten und Knöpfe" beim Punkt Aktivieren belegt ist gedrückt (bitte die selbe Taste im Spiel wie im Plugin belegen). Der Button wechselt zu ON. Sobald das maximale Tankvolumen erreicht ist wird die Taste automatisch wieder losgelassen. Der Button wechselt zu OFF.


Scheibenwischer, Gangschaltung, Motorbremse

Für den Scheibenwischer habe ich im Spiel 2 Tasten belegt: Scheibenwischer verlangsamen (Numpad /) und Scheibenwischer (P)
Für das Level der Motorbremse habe ich auch 2 Tasten belegt: Stufe Erhöhen (Numpad+) Stufe Verringern (Numpad -)
Für die Automatik Gangschaltung habe ich 3 Tasten im Spiel belegt: Gang Runter (Rechte STRG Taste), Gang Rauf (rechte Shift Taste) und auf Neutral Schalten (Komma)


Seite 2

Wenn der Button "Seite 2" nicht funktioniert den Button im Touch Portal am PC bitte anklicken und unter On Pressed bei "Go to page" auf meine 2te Seite verweisen.

