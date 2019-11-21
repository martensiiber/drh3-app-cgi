import json
import random

path = "src/data/adr_valim_xy_aggr.json"
with open(path) as f:
    data = json.load(f)
    for row in data:
        # 33
        if 'is_visited' not in row:
            row['is_visited'] = random.random()<0.33
        
        if 'kaugused' not in row:
            row['kaugused'] = [{'sisendaadressi_id': 1, 'kaugus': 1.2}, {'sisendaadressi_id': 2, 'kaugus': 0.124}, {'sisendaadressi_id': 6, 'kaugus': 5.8},]
    
with open(path, 'w') as f:
    json.dump(data, f, indent=2)