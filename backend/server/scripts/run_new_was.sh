CURRENT_PORT=$(cat /home/ubuntu/service_url.inc | grep -Po '[0-9]+' | tail -1)


TARGET_PORT=0

echo "> Current port of running WAS is ${CURRENT_PORT}."

if [ ${CURRENT_PORT} -eq 8080 ]; then  
  TARGET_PORT=8081  
elif [ ${CURRENT_PORT} -eq 8081 ]; then
  TARGET_PORT=8080 
else
  echo "> No WAS is connected to nginx"
fi

TARGET_PID=$(lsof -Fp -i TCP:${TARGET_PORT} | grep -Po 'p[0-9]+' | grep -Po '[0-9]+')

if [ ! -z ${TARGET_PID} ]; then
  echo "> Kill WAS running at ${TARGET_PORT}."
  sudo kill ${TARGET_PID}
fi


nohup java -jar \
    -Dserver.port=8081 \
    -Dspring.profiles.active=prod \
    /var/shop/sellution/cicd_template/build/libs/server-0.0.1-SNAPSHOT.jar > "$LOG_FILE" 2>&1 &
    
echo "> Now new WAS runs at ${TARGET_PORT}."

sleep 10s # 10초 대기
exit 0
