import pandas as pd

# Specify the file paths
input_file_path = r"C:\Users\thomp\Downloads\crt.xlsx"  # Adjust the path if needed
output_file_path = r"C:\Users\thomp\Downloads\data.json"

# Load the Excel file
df = pd.read_excel(input_file_path)

# Convert the dataframe to JSON format
df.to_json(output_file_path, orient='records')

# Notify the user that the file has been saved
print(f"JSON file has been saved to {output_file_path}")
