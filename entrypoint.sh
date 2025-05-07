#!/bin/bash
export HOST_IP=$(ip route show default | grep -Eo 'via ([0-9]{1,3}\.){3}[0-9]{1,3}' | awk '{print $2}')

if [[ -z "$POSTGRES_HOST" ]]; then
	POSTGRES_HOST="localhost"
fi
if [[ -z "$POSTGRES_PORT" ]]; then
	POSTGRES_PORT="5432"
fi

RESULT="false"
MAX_RETRIES=5
RETRIES=0
while [[ "$RESULT" == "false" ]] do
	if sleep 1 && timeout 1 telnet $POSTGRES_HOST $POSTGRES_PORT  2>&1 | grep -q 'Connected'; then
		RESULT="true"
	else
		echo "Connection failed, retrying $(($RETRIES + 1))"
	fi

	RETRIES=$(($RETRIES + 1))
	if [[ $RETRIES -ge $MAX_RETRIES ]]; then
		break
	fi
done

if [[ "$RESULT" == "true" ]]; then
	exec "$@"
fi
