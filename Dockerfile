FROM openjdk:17

WORKDIR /app

# PaperMC 1.16.5 build 792 indir
RUN curl -o paper.jar https://api.papermc.io/v2/projects/paper/versions/1.16.5/builds/792/downloads/paper-1.16.5-792.jar

# EULA kabul et
RUN echo "eula=true" > eula.txt

# playit.gg kurulumu için apt setup
RUN apt update && apt install -y curl gnupg

RUN curl -s https://playit.gg/install.sh | bash

COPY start.sh .

RUN chmod +x start.sh

EXPOSE 25565

CMD ["./start.sh"]
