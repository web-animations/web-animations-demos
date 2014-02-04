@ECHO OFF
ECHO [%1]
SET name=%1
CALL grunt compile -doc=%name%
ECHO ON
COPY data\data.json ..\..\%name%\docs.json /Y
