#!/bin/bash
export HOST_IP=$(ip route show default | grep -Eo 'via ([0-9]{1,3}\.){3}[0-9]{1,3}' | awk '{print $2}')
exec "$@"
