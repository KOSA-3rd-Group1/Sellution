
CURRENT_PORT=$(cat /home/ubuntu/service_url.inc | grep -Po '[0-9]+' | tail -1)
TARGET_PORT=0

if [ ${CURRENT_PORT} -eq 9090 ]; then
    TARGET_PORT=9091
elif [ ${CURRENT_PORT} -eq 9091 ]; then
    TARGET_PORT=9090
else
    echo "> No WAS is connected to nginx"
    exit 1
fi

echo "> Start health check of WAS at 'http://127.0.0.1:${TARGET_PORT}' ..."

for RETRY_COUNT in 1 2 3 4 5 6 7 8 9 10
do
    echo "> #${RETRY_COUNT} trying..."

    RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}"  http://127.0.0.1:${TARGET_PORT}/test/running)

    if [ ${RESPONSE_CODE} -eq 200 ]; then
        echo "> New WAS successfully running" 
        exit 0
    elif [ ${RETRY_COUNT} -eq 10 ]; then
        echo "> Health check failed."
        exit 1
    fi
    sleep 10
done
