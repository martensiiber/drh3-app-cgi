import json
path = "src/data/adr_valim_xy.json"
with open(path) as f:
    data = json.load(f)
    for row in data:
        row['kaugused'] = [{'sisendaadressi_id': 1, 'kaugus': 1.2}, {'sisendaadressi_id': 2, 'kaugus': 0.124}, {'sisendaadressi_id': 6, 'kaugus': 5.8},]
    
with open(path, 'w') as f:
    json.dump(data, f, indent=2)