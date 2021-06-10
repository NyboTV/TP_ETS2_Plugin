@Echo Off 
title ETS2 Dashboard Updater 
echo Restarting TouchPortal 
tasklist /fi "ImageName eq javaw.exe" /fo csv 2>NUL | find /I "javaw.exe">NUL 
if "%ERRORLEVEL%"=="0" taskkill /F /IM javaw.exe 
ping -n 5 localhost >nul 
start "" "C:/ProgramData/Microsoft/Windows/Start Menu/Programs/Touch Portal/Touch Portal.lnk"