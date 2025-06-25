FROM openjdk:17

WORKDIR /app

# Gerekli paketleri kur
RUN apt update && apt install -y curl tar python3

# PaperMC'yi indir
RUN curl -o paper.jar https://api.papermc.io/v2/projects/paper/versions/1.16.5/builds/792/downloads/paper-1.16.5-792.jar

# EULA'yı kabul et
RUN echo "eula=true" > eula.txt

# Playit Agent'ı indir
RUN curl -L -o playit https://github.com/playit-cloud/playit-agent/releases/download/v0.15.26/playit-linux-amd64 && \
    chmod +x playit

# HTML ve başlatıcı dosyaları kopyala
COPY index.html .
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 80
EXPOSE 25565

CMD ["bash", "start.sh"]
