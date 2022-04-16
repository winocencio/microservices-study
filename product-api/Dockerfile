FROM maven:3.6.3-jdk-11
COPY . .
WORKDIR .
RUN mvn clean install
EXPOSE 8081
CMD ["mvn", "spring-boot:run"]