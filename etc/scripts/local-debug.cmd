: <<EOF
@echo off
goto Windows
EOF
exec cmd //c $0 $*

rem  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
rem     <one line to give the program's name and a brief idea of what it does.>
rem     Copyright (C) 2019  jeffy-g hirotom1107@gmail.com
rem 
rem     This program is free software: you can redistribute it and/or modify
rem     it under the terms of the GNU Affero General Public License as
rem     published by the Free Software Foundation, either version 3 of the
rem     License, or (at your option) any later version.
rem 
rem     This program is distributed in the hope that it will be useful,
rem     but WITHOUT ANY WARRANTY; without even the implied warranty of
rem     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
rem     GNU Affero General Public License for more details.
rem 
rem     You should have received a copy of the GNU Affero General Public License
rem     along with this program.  If not, see <https://www.gnu.org/licenses/>.
rem  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

REM TODO: write shell script version.
rem 190524 cannot work this script (windows)
rem   because command line `git log -1 --date=iso --pretty="format:%cd %s [%an]"` is cannot fire properly

:Windows
echo - - - - - - - - - start local debug with browser-sync - - - - - - - - -
echo  [options] -f: force rebuild
echo - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if "%1"=="-f" (
	goto webpack
) else if "%2"=="-f" (
	goto webpack
) else if not exist ".\docs" (
	goto webpack
)

if not exist ".\docs\sw.js" (
	goto workbox
)

goto :server

:webpack
npm run webpack:prod
rem npm run webpack:prod -- --publish
:workbox
npm run workbox:lib

rem
rem xs - no server
rem
if "%1"=="-xs" (
	goto done
)
if "%2"=="-xs" (
	goto done
)

:server
echo --- starting local server at http://localhost:8111 ---
npm run server

:done
