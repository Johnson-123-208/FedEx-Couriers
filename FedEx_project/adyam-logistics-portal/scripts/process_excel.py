import pandas as pd
import os

# Path to the dataset (Parent directory of the app)
dataset_path = os.path.join(os.path.dirname(__file__), '../../DataSet.xlsx')

def clean_text(val):
    s = str(val).strip()
    if pd.isna(val) or s == "" or s.lower() == "nan": return "NULL"
    return "'" + s.replace("'", "''") + "'"

def clean_num(val):
    if pd.isna(val): return "NULL"
    try:
        return str(float(val))
    except:
        return "NULL"

print(f"Reading {dataset_path}...")
try:
    df = pd.read_excel(dataset_path)
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

sql_lines = []
sql_lines.append("-- Auto-generated from DataSet.xlsx")

for index, row in df.iterrows():
    awb_raw = row.get('AWBNO.', '')
    if pd.isna(awb_raw) or str(awb_raw).strip() == "": continue
    
    awb = clean_text(awb_raw)
    service = clean_text(row.get('SERVICE'))
    sender = clean_text(row.get('SENDER'))
    receiver = clean_text(row.get('RECEIVER'))
    shipment = clean_text(row.get('SHIPMENT'))
    dest = clean_text(row.get('DESTINATION'))
    weight = clean_num(row.get('WEIGHT'))
    contents = clean_text(row.get('CONTENTS'))
    status = clean_text(row.get('STATUS'))
    remarks = clean_text(row.get('REMARKS'))
    
    val_str = f"({awb}, {service}, {sender}, {receiver}, {shipment}, {dest}, {weight}, {contents}, {status}, {remarks})"
    
    # Conflict strategy: Updating status ensures latest event is captured if duplicates exist
    sql = f"INSERT INTO public.adyam_tracking (awb_no, service_provider, sender, receiver, shipment_by, destination, weight_kg, contents, status, remarks) VALUES {val_str} ON CONFLICT (awb_no) DO UPDATE SET status = EXCLUDED.status, last_location = EXCLUDED.last_location;"
    sql_lines.append(sql)

output_path = os.path.join(os.path.dirname(__file__), '../db/migrations/0001_initial_data.sql')
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_lines))

print(f"Generated {len(sql_lines)} statements at {output_path}")
