import time
import json
from retrieve_hungermap_data.index import handler

# Warm-up interval in seconds (e.g., 5 minutes)
warm_up_interval = 300

# Number of warm-up invocations
num_warm_ups = 5

# Simulate warm-up by invoking the Lambda function multiple times
for i in range(num_warm_ups):
    print(f"Running warm-up {i + 1}/{num_warm_ups}...")
    event = {"warmer": True}  # Create a warm-up event
    context = None  # In a real AWS environment, the context would be provided by AWS
    response = handler(event, context)
    print("Warm-up response:", json.dumps(response))
    time.sleep(warm_up_interval)

print("Warm-up process completed.")
