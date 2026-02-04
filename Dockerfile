FROM busybox:1.37.0

RUN adduser -D static
USER static
WORKDIR /home/static
COPY ./russian-words/russian.txt dictionary-cp1251.txt
COPY . .
CMD ["busybox", "httpd", "-f", "-v", "-p", "9999"]
