FROM ywldragon/mywebsite:intact

COPY ./backend/java /mywebsite/backend

EXPOSE 1314

ENTRYPOINT [ "java", "-jar","/mywebsite/backend/java/target/mywebsite-0.0.1-SNAPSHOT.jar" ]