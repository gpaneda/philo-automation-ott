#!/bin/bash

# Function to check if Appium server is running
check_appium() {
    curl -s http://localhost:4723/wd/hub/status > /dev/null
    return $?
}

# Function to start Appium server
start_appium() {
    echo "Starting Appium server..."
    appium --base-path /wd/hub &
    APPIUM_PID=$!
    
    # Wait for Appium to start (max 30 seconds)
    for i in {1..30}; do
        if check_appium; then
            echo "Appium server started successfully!"
            return 0
        fi
        sleep 1
    done
    
    echo "Failed to start Appium server"
    kill $APPIUM_PID
    return 1
}

# Main script
echo "Checking Appium server status..."

if ! check_appium; then
    echo "Appium server is not running"
    start_appium
    if [ $? -ne 0 ]; then
        echo "Failed to start Appium server. Please check your installation."
        exit 1
    fi
else
    echo "Appium server is already running"
fi

# Process environment variables and command
while [ $# -gt 0 ]; do
    if [[ $1 == *=* ]]; then
        # This is an environment variable assignment
        export "$1"
        shift
    else
        # This is the actual command
        break
    fi
done

# Execute the remaining command
echo "Executing command: $@"
"$@"
EXIT_CODE=$?

# Cleanup if needed
if [ $EXIT_CODE -ne 0 ]; then
    echo "Command failed with exit code: $EXIT_CODE"
fi

exit $EXIT_CODE 