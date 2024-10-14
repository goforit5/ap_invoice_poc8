#!/bin/bash

# Function to check if a port is in use
port_in_use() {
    lsof -i:$1 >/dev/null 2>&1
}

# Function to kill processes on specific ports
kill_port() {
    lsof -ti:$1 | xargs kill -9
}

# Clean up function
cleanup() {
    echo "Cleaning up..."
    kill_port 3000
    exit
}

# Set up trap to call cleanup function on script exit
trap cleanup EXIT

# Check and start frontend server
if port_in_use 3000; then
    echo "Port 3000 is already in use. Killing the process..."
    kill_port 3000
fi

echo "Starting frontend server..."
npm start &
frontend_pid=$!

# Wait for frontend to start
while ! nc -z localhost 3000; do   
  sleep 0.1
done

echo "Frontend server is now running."
echo "Access the app at http://localhost:3000"

# Keep the script running
wait $frontend_pid
