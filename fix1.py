with open('app/contar-mi-sueno/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('const handleSubmit = async () => {\n    if (!title.trim() || !history.trim()) {', 'const handleSubmit = async () => {\n    const userId = localStorage.getItem("ayudarte_user_id");\n    if (!title.trim() || !history.trim()) {')

c = c.replace('if (!isLoggedIn) {', 'if (!userId) {')

with open('app/contar-mi-sueno/page.tsx', 'w') as f:
    f.write(c)
