FROM ywldragon/backend:centos_java8_mysql_maven

COPY /backend/java /workspace

EXPOSE 1314


CMD [ "java", "-jar","/workspace/target/mywebsite-0.0.1-SNAPSHOT.jar" ]