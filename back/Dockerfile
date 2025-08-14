FROM eclipse-temurin:21-jdk

# 필수 런타임 라이브러리(noble: t64들 포함)
RUN apt-get update && apt-get install -y \
  curl unzip ca-certificates \
  libnss3 libxss1 libasound2t64 libatk-bridge2.0-0t64 libgtk-3-0t64 \
  libdrm2 libgbm1 libxshmfence1 libu2f-udev libvulkan1 libcups2t64 \
  fonts-liberation \
  libx11-6 libxcomposite1 libxrandr2 libxdamage1 libxrender1 \
  libxi6 libxtst6 libxkbcommon0 libxext6 libx11-xcb1 \
  libpango-1.0-0 libpangocairo-1.0-0 libatspi2.0-0t64 \
  libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Chrome for Testing + Chromedriver (버전 고정)
RUN set -eux; \
  CFT_VER="129.0.6668.70"; \
  curl -fsSLo /tmp/chrome.zip  "https://storage.googleapis.com/chrome-for-testing-public/${CFT_VER}/linux64/chrome-linux64.zip"; \
  curl -fsSLo /tmp/driver.zip  "https://storage.googleapis.com/chrome-for-testing-public/${CFT_VER}/linux64/chromedriver-linux64.zip"; \
  unzip -qo /tmp/chrome.zip -d /opt; \
  unzip -qo /tmp/driver.zip -d /opt; \
  ln -sf /opt/chrome-linux64/chrome /usr/bin/google-chrome; \
  ln -sf /opt/chromedriver-linux64/chromedriver /usr/bin/chromedriver; \
  rm -f /tmp/*.zip

# 앱
COPY build/libs/recode-0.0.1-SNAPSHOT.jar /app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

