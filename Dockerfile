FROM openjdk:17-slim

WORKDIR /app

RUN apt update && apt install -y curl gnupg


RUN echo "eula=true" > eula.txt


RUN curl -SsL https://playit-cloud.github.io/ppa/key.gpg | gpg --dearmor -o /usr/share/keyrings/playit.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/playit.gpg] https://playit-cloud.github.io/ppa/data ./" > /etc/apt/sources.list.d/playit-cloud.list

RUN apt update && apt install -y playit



COPY start.sh .

RUN chmod +x start.sh

EXPOSE 25565

CMD ["./start.sh"]
