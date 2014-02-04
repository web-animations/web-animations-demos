@ECHO OFF
CALL grunt
COPY docs\data.json ..\docs.json /Y
