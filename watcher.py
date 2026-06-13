import os
import time
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "raw"
STATE_FILE = BASE_DIR / ".watcher_state.json"

def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"processed_files": []}

def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=4)

def main():
    print("==================================================")
    print("[WATCHER] Starting directory watcher for raw/...")
    print("[WATCHER] Waiting for new documents to be added...")
    print("==================================================\n")
    
    while True:
        state = load_state()
        current_files = list(RAW_DIR.glob("*.*"))
        
        for file_path in current_files:
            if file_path.name not in state["processed_files"]:
                print(f"\n[WATCHER] NEW FILE DETECTED: {file_path.name}")
                print(f"[WATCHER] Agent, please read the contents of 'raw/{file_path.name}'.")
                print(f"[WATCHER] Then follow 'RULES.md' to compile it into the 'wiki/' directory!")
                print(f"[WATCHER] Once you are done processing, update the index and wait for the next file.\n")
                
                # Mark as processed immediately so we don't spam the terminal
                state["processed_files"].append(file_path.name)
                save_state(state)
        
        time.sleep(2)

if __name__ == "__main__":
    main()
