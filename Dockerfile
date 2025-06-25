FROM openjdk:17-slim

WORKDIR /app

RUN apt update && apt install -y curl gnupg

RUN curl -o paper.jar https://api.papermc.io/v2/projects/paper/versions/1.16.5/builds/792/downloads/paper-1.16.5-792.jar

RUN echo "eula=true" > eula.txt

RUN curl -L -o playit.tar.gz https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-x64.tar.gz && \
    tar -xzf playit.tar.gz && \
    rm playit.tar.gz


COPY start.sh .

RUN chmod +x start.sh

EXPOSE 25565

CMD ["./start.sh"]
