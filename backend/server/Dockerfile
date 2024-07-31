# Dockerfile

# spring boot 어플리케이션을 실행하기 위해 jdk17를 베이스 이미지로 지정 - 베이스 이미지 기반으로 spring boot docker 이미지가 생성된다.
FROM openjdk:17

# ARG [: docker 이미지 빌드시점에 사용할수 있는 인자 설정]
# spring boot 어플리케이션 build 후 생성되는 jar 파일의 저장 위치를 JAR_FILE이라는 변수에 지정
# Docker 이미지를 빌드할때 사용할 jar파일의 위치를 변수에 지정
ARG JAR_FILE=build/libs/*.jar

# COPY -> 이미지 생성시 파일 복사하는 명령어
# JAR_FILE 변수에 있는 스프링 어플리케이션의 jar파일이 app.jar 라는 이름으로 Docker 이미지내에 복사된다.
COPY ${JAR_FILE} app.jar

# ENTRYPOINT는 컨테이너가 시작될때 실행될 명령어를 지정한다. [ 이 docker 이미지를 실행할때 실행될 명령어를 지정 ]
# java -jar app.jar 명령어를 실행하여 스프링 부트 어플리케이션을 실행한다.
ENTRYPOINT ["java", "-jar", "app.jar"]