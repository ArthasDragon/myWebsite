FROM ywldragon/mywebsite:env

COPY ./backend/java /mywebsite/backend/java

EXPOSE 1314

ENTRYPOINT [ "java", "-jar","/mywebsite/backend/java/target/mywebsite-0.0.1-SNAPSHOT.jar" ]