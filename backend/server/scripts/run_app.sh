APP_NAME="sellution"
CURRENT_PORT=$(cat /home/ubuntu/service_url.inc | grep -Po '[0-9]+' | tail -1)

# 로그 디렉토리 생성
LOG_DIR="/var/log/$APP_NAME"
sudo mkdir -p $LOG_DIR
sudo chown $USER:$USER $LOG_DIR

# 현재 날짜와 시간으로 로그 파일 이름 생성
LOG_FILE="$LOG_DIR/app_$(date +%Y%m%d_%H%M%S).log"

# 현재 실행 중인 애플리케이션 프로세스 확인 및 종료
CURRENT_PID=$(pgrep -f server-0.0.1-SNAPSHOT.jar)
if [ -n "$CURRENT_PID" ]; then
    echo "현재 실행 중인 애플리케이션을 종료합니다. (PID: $CURRENT_PID)"
    kill $CURRENT_PID
    sleep 5

    # 프로세스가 여전히 실행 중인지 확인
    if kill -0 $CURRENT_PID 2>/dev/null; then
        echo "애플리케이션이 정상적으로 종료되지 않았습니다. 강제 종료합니다."
        kill -9 $CURRENT_PID
    fi
fi

# Java 애플리케이션 실행 (prod 프로파일 사용)
echo "새로운 애플리케이션을 시작합니다."
nohup java -jar \
    -Dserver.port=8081 \
    -Dspring.profiles.active=prod \
    /var/shop/sellution/cicd_template/build/libs/server-0.0.1-SNAPSHOT.jar > "$LOG_FILE" 2>&1 &

echo "애플리케이션이 prod 프로파일로 시작되었습니다. 로그 파일: $LOG_FILE"

# 새 프로세스 ID 확인
NEW_PID=$!
echo "새로운 애플리케이션 PID: $NEW_PID"

# 애플리케이션 시작 확인
sleep 10
if ps -p $NEW_PID > /dev/null; then
    echo "새로운 애플리케이션이 성공적으로 시작되었습니다."
else
    echo "새로운 애플리케이션 시작에 실패했습니다. 로그를 확인해 주세요."
fi