import json

with open('package.json', 'r') as f:
    data = json.load(f)

data['dependencies']['@capacitor/core'] = '^6.0.0'
data['dependencies']['@capacitor/android'] = '^6.0.0'
data['devDependencies']['@capacitor/cli'] = '^6.0.0'

with open('package.json', 'w') as f:
    json.dump(data, f, indent=2)

