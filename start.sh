#!/bin/bash

# Minecraft sunucusunu arka planda başlat
java -Xmx1G -Xms1G -jar paper-1.16.5-792.jar nogui &


# playit.gg port açsın
./playit -t minecraft &

python3 -m http.server 80
