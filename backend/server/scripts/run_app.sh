APP_NAME="sellution"

# 로그 디렉토리 생성
LOG_DIR="/var/log/$APP_NAME"
sudo mkdir -p $LOG_DIR
sudo chown $USER:$USER $LOG_DIR

# 현재 날짜와 시간으로 로그 파일 이름 생성
LOG_FILE="$LOG_DIR/app_$(date +%Y%m%d_%H%M%S).log"

# Java 애플리케이션 실행 (prod 프로파일 사용)
nohup java -jar \
    -Dserver.port=8081 \
    -Dspring.profiles.active=prod \
    /var/shop/sellution/cicd_template/build/libs/server-0.0.1-SNAPSHOT.jar > "$LOG_FILE" 2>&1 &

echo "애플리케이션이 prod 프로파일로 시작되었습니다. 로그 파일: $LOG_FILE"
