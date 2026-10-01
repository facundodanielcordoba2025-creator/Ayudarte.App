with open('.github/workflows/build-android.yml', 'r') as f:
    c = f.read()

c = c.replace('node-version: 20', 'node-version: 22')
c = c.replace("node-version: '20'", "node-version: '22'")

with open('.github/workflows/build-android.yml', 'w') as f:
    f.write(c)
