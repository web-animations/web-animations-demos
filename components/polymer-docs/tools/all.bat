@ECHO OFF

FOR /d %%D IN (..\..\*) DO CALL :SUB_A %%~nD
GOTO:EOF

:SUB_A
  ECHO [%1]
  SET name=%1
  CALL grunt compile -doc=%name%
  COPY data\data.json ..\..\%name%\docs.json /Y
GOTO:EOF