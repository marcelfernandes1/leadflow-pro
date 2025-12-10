#!/bin/bash

# Tech Detector API startup script

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt -q

# Run the API server
echo "Starting Tech Detector API on port ${PORT:-5001}..."
python api.py
