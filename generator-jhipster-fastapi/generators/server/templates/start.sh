#!/bin/bash

# Step 1: Create virtual environment
python3 -m venv .venv

# Step 2: Activate virtual environment
source .venv/bin/activate

# Step 3: Install requirements
pip install -r requirements.txt


 python3 app/main.py