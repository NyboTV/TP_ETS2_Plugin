::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdD+DJH2N8VE1OltkbzimM2CvC7AS/O3HyOOTilgfaNYPR6rv6eaxEOwG7UzqSYQswVN3v/cAAxxXMBuoYW8=
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSzk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdD+DJH2N8VE1OltkbzimM2CvC7AS/O3HyOOTilgfaNYPR6rv6eaxEOwG7UzqSbQ433ZepO44P0lnWhO4Zg07qHxGinSXMtSIsh31BE2R4ys=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off

if exist tmp\ETS2_Dashboard\ (
  goto update
) else (
  goto start_plugin
)


:update
move  "%appdata%\TouchPortal\plugins\tmp\ETS2_Dashboard\updater.exe" "%appdata%\TouchPortal\plugins\ETS2_Dashboard\updater.exe"
move  "%appdata%\TouchPortal\plugins\tmp\ETS2_Dashboard\ets2_plugin.exe" "%appdata%\TouchPortal\plugins\ETS2_Dashboard\ets2_plugin.exe"

@RD /S /Q "%appdata%\TouchPortal\plugins\tmp\ETS2_Dashboard\

goto start_plugin

:start_plugin
Start /B "Updater" "%appdata%\TouchPortal\plugins\ETS2_Dashboard\ets2_plugin.exe"
exit